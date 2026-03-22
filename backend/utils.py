import hashlib
import time
from hashids import Hashids
from config import Config

hashids = Hashids(salt=Config.SECRET_KEY, min_length=Config.SHORT_CODE_LENGTH)

class Response:
    @staticmethod
    def success(data=None, message='Success', code=200):
        return {
            'code': code,
            'message': message,
            'data': data,
            'timestamp': int(time.time() * 1000)
        }
    
    @staticmethod
    def error(message='Error', code=400, data=None):
        return {
            'code': code,
            'message': message,
            'data': data,
            'timestamp': int(time.time() * 1000)
        }

def generate_short_code(url: str, counter: int = None) -> str:
    if counter is not None:
        return hashids.encode(counter)
    
    hash_input = f"{url}{time.time()}"
    hash_value = int(hashlib.md5(hash_input.encode()).hexdigest()[:8], 16)
    return hashids.encode(hash_value)

def is_valid_url(url: str) -> bool:
    if not url:
        return False
    if not url.startswith(('http://', 'https://')):
        return False
    return len(url) <= 2048

def format_stats_row(row) -> dict:
    return {
        'shortCode': row['short_code'],
        'originalUrl': row['original_url'],
        'totalVisits': row['total_visits'],
        'createdAt': row['created_at']
    }
