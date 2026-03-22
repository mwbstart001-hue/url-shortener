from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
from datetime import datetime
import json

from config import Config
from database import db
from models import Url, Visit, UrlStats
from utils import Response, generate_short_code, is_valid_url, format_stats_row

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

@app.route('/api/shorten', methods=['POST'])
def shorten_url():
    try:
        data = request.get_json()
        if not data:
            return jsonify(Response.error('Request body is required')), 400
        
        original_url = data.get('url', '').strip()
        custom_code = data.get('custom_code', '').strip()
        expires_at = data.get('expires_at')
        
        if not is_valid_url(original_url):
            return jsonify(Response.error('Invalid URL. Must start with http:// or https://')), 400
        
        cache_key = f"url:{custom_code if custom_code else 'auto'}"
        
        if custom_code:
            if len(custom_code) < 3 or len(custom_code) > 20:
                return jsonify(Response.error('Custom code must be between 3 and 20 characters')), 400
            
            with db.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute('SELECT id FROM urls WHERE short_code = ?', (custom_code,))
                if cursor.fetchone():
                    return jsonify(Response.error('Custom code already exists')), 400
            
            short_code = custom_code
        else:
            with db.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute('SELECT MAX(id) as max_id FROM urls')
                result = cursor.fetchone()
                counter = (result['max_id'] or 0) + 1
                short_code = generate_short_code(original_url, counter)
        
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO urls (short_code, original_url, expires_at)
                VALUES (?, ?, ?)
            ''', (short_code, original_url, expires_at))
            conn.commit()
        
        short_url = f"{Config.BASE_URL}/{short_code}"
        
        db.redis_client.setex(
            f"redirect:{short_code}",
            Config.CACHE_EXPIRE_SECONDS,
            original_url
        )
        
        return jsonify(Response.success({
            'shortCode': short_code,
            'shortUrl': short_url,
            'originalUrl': original_url,
            'createdAt': datetime.now().isoformat()
        }, 'Short URL created successfully')), 201
        
    except Exception as e:
        return jsonify(Response.error(str(e))), 500

@app.route('/api/expand/<short_code>', methods=['GET'])
def expand_url(short_code):
    try:
        cached_url = db.redis_client.get(f"redirect:{short_code}")
        if cached_url:
            return jsonify(Response.success({
                'shortCode': short_code,
                'originalUrl': cached_url,
                'cached': True
            })), 200
        
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT short_code, original_url, created_at, expires_at, is_active
                FROM urls WHERE short_code = ?
            ''', (short_code,))
            row = cursor.fetchone()
            
            if not row:
                return jsonify(Response.error('Short URL not found')), 404
            
            if not row['is_active']:
                return jsonify(Response.error('Short URL is inactive')), 410
            
            if row['expires_at'] and datetime.fromisoformat(row['expires_at']) < datetime.now():
                return jsonify(Response.error('Short URL has expired')), 410
        
        db.redis_client.setex(
            f"redirect:{short_code}",
            Config.CACHE_EXPIRE_SECONDS,
            row['original_url']
        )
        
        return jsonify(Response.success({
            'shortCode': short_code,
            'originalUrl': row['original_url'],
            'createdAt': row['created_at'],
            'cached': False
        })), 200
        
    except Exception as e:
        return jsonify(Response.error(str(e))), 500

@app.route('/<short_code>', methods=['GET'])
def redirect_url(short_code):
    try:
        cached_url = db.redis_client.get(f"redirect:{short_code}")
        
        if cached_url:
            record_visit(short_code, request)
            return redirect(cached_url, code=302)
        
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT original_url, is_active, expires_at
                FROM urls WHERE short_code = ?
            ''', (short_code,))
            row = cursor.fetchone()
            
            if not row:
                return jsonify(Response.error('Short URL not found')), 404
            
            if not row['is_active']:
                return jsonify(Response.error('Short URL is inactive')), 410
            
            if row['expires_at'] and datetime.fromisoformat(row['expires_at']) < datetime.now():
                return jsonify(Response.error('Short URL has expired')), 410
            
            original_url = row['original_url']
        
        db.redis_client.setex(
            f"redirect:{short_code}",
            Config.CACHE_EXPIRE_SECONDS,
            original_url
        )
        
        record_visit(short_code, request)
        return redirect(original_url, code=302)
        
    except Exception as e:
        return jsonify(Response.error(str(e))), 500

def record_visit(short_code, request):
    try:
        ip_address = request.headers.get('X-Forwarded-For', request.remote_addr)
        user_agent = request.headers.get('User-Agent', '')
        referer = request.headers.get('Referer', '')
        
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO visits (short_code, ip_address, user_agent, referer)
                VALUES (?, ?, ?, ?)
            ''', (short_code, ip_address, user_agent, referer))
            conn.commit()
        
        db.redis_client.incr(f"stats:{short_code}:visits")
        
    except Exception:
        pass

@app.route('/api/stats/<short_code>', methods=['GET'])
def get_stats(short_code):
    try:
        cached_stats = db.redis_client.get(f"stats:{short_code}:info")
        if cached_stats:
            stats_data = json.loads(cached_stats)
            stats_data['cached'] = True
            return jsonify(Response.success(stats_data)), 200
        
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT u.short_code, u.original_url, u.created_at,
                       COUNT(v.id) as total_visits
                FROM urls u
                LEFT JOIN visits v ON u.short_code = v.short_code
                WHERE u.short_code = ?
                GROUP BY u.short_code
            ''', (short_code,))
            row = cursor.fetchone()
            
            if not row:
                return jsonify(Response.error('Short URL not found')), 404
            
            cursor.execute('''
                SELECT visited_at, ip_address, user_agent, referer
                FROM visits
                WHERE short_code = ?
                ORDER BY visited_at DESC
                LIMIT 10
            ''', (short_code,))
            recent_visits = [dict(v) for v in cursor.fetchall()]
        
        stats_data = {
            'shortCode': row['short_code'],
            'originalUrl': row['original_url'],
            'totalVisits': row['total_visits'],
            'createdAt': row['created_at'],
            'recentVisits': recent_visits,
            'cached': False
        }
        
        db.redis_client.setex(
            f"stats:{short_code}:info",
            300,
            json.dumps(stats_data)
        )
        
        return jsonify(Response.success(stats_data)), 200
        
    except Exception as e:
        return jsonify(Response.error(str(e))), 500

@app.route('/api/stats', methods=['GET'])
def get_all_stats():
    try:
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        offset = (page - 1) * per_page
        
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT u.short_code, u.original_url, u.created_at,
                       COUNT(v.id) as total_visits
                FROM urls u
                LEFT JOIN visits v ON u.short_code = v.short_code
                GROUP BY u.short_code
                ORDER BY u.created_at DESC
                LIMIT ? OFFSET ?
            ''', (per_page, offset))
            rows = cursor.fetchall()
            
            cursor.execute('SELECT COUNT(*) as total FROM urls')
            total = cursor.fetchone()['total']
        
        stats_list = [format_stats_row(row) for row in rows]
        
        return jsonify(Response.success({
            'stats': stats_list,
            'pagination': {
                'page': page,
                'perPage': per_page,
                'total': total,
                'totalPages': (total + per_page - 1) // per_page
            }
        })), 200
        
    except Exception as e:
        return jsonify(Response.error(str(e))), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    try:
        db.redis_client.ping()
        redis_status = 'healthy'
    except Exception:
        redis_status = 'unhealthy'
    
    try:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT 1')
        sqlite_status = 'healthy'
    except Exception:
        sqlite_status = 'unhealthy'
    
    return jsonify(Response.success({
        'status': 'ok' if redis_status == 'healthy' and sqlite_status == 'healthy' else 'degraded',
        'services': {
            'redis': redis_status,
            'sqlite': sqlite_status
        }
    })), 200

@app.route('/', methods=['GET'])
def index():
    return redirect('/index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
