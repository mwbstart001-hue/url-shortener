import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-change-in-production')
    DATABASE_PATH = os.getenv('DATABASE_PATH', '/app/data/shorturl.db')
    REDIS_HOST = os.getenv('REDIS_HOST', 'redis')
    REDIS_PORT = int(os.getenv('REDIS_PORT', 6379))
    REDIS_DB = int(os.getenv('REDIS_DB', 0))
    BASE_URL = os.getenv('BASE_URL', 'http://localhost:5000')
    SHORT_CODE_LENGTH = int(os.getenv('SHORT_CODE_LENGTH', 6))
    CACHE_EXPIRE_SECONDS = int(os.getenv('CACHE_EXPIRE_SECONDS', 86400))
