from dataclasses import dataclass
from datetime import datetime
from typing import Optional

@dataclass
class Url:
    id: int
    short_code: str
    original_url: str
    created_at: datetime
    expires_at: Optional[datetime]
    is_active: bool
    
    @classmethod
    def from_row(cls, row) -> 'Url':
        return cls(
            id=row['id'],
            short_code=row['short_code'],
            original_url=row['original_url'],
            created_at=datetime.fromisoformat(row['created_at']) if row['created_at'] else None,
            expires_at=datetime.fromisoformat(row['expires_at']) if row['expires_at'] else None,
            is_active=bool(row['is_active'])
        )

@dataclass
class Visit:
    id: int
    short_code: str
    visited_at: datetime
    ip_address: Optional[str]
    user_agent: Optional[str]
    referer: Optional[str]
    
    @classmethod
    def from_row(cls, row) -> 'Visit':
        return cls(
            id=row['id'],
            short_code=row['short_code'],
            visited_at=datetime.fromisoformat(row['visited_at']) if row['visited_at'] else None,
            ip_address=row['ip_address'],
            user_agent=row['user_agent'],
            referer=row['referer']
        )

@dataclass
class UrlStats:
    short_code: str
    original_url: str
    total_visits: int
    created_at: datetime
    recent_visits: list
