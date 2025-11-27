"""
Database initialization script for authentication system.
This script will:
1. Drop all existing tables
2. Recreate tables with new user relationships
3. Sync users from .env to database
"""

import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from database import engine, Base, SessionLocal
from models import User

load_dotenv()

def get_env_users():
    """Load username/password pairs from .env file"""
    users = {}
    i = 1
    while True:
        username_key = f"USER_{i}_USERNAME"
        password_key = f"USER_{i}_PASSWORD"
        
        username = os.getenv(username_key)
        password = os.getenv(password_key)
        
        if not username or not password:
            break
            
        users[username] = password
        i += 1
    
    return users

def init_database():
    """Initialize database with clean schema and users from .env"""
    print("🗑️  Dropping all existing tables...")
    Base.metadata.drop_all(bind=engine)
    
    print("📦 Creating new database schema...")
    Base.metadata.create_all(bind=engine)
    
    print("👥 Syncing users from .env...")
    env_users = get_env_users()
    
    if not env_users:
        print("⚠️  Warning: No users found in .env file!")
        print("   Add users in format: USER_1_USERNAME=demo and USER_1_PASSWORD=demo123")
        return
    
    db = SessionLocal()
    try:
        for username in env_users.keys():
            # Check if user already exists
            existing_user = db.query(User).filter(User.username == username).first()
            if not existing_user:
                user = User(username=username)
                db.add(user)
                print(f"   ✅ Created user: {username}")
            else:
                print(f"   ℹ️  User already exists: {username}")
        
        db.commit()
        print(f"\n✨ Database initialized successfully! {len(env_users)} user(s) ready.")
        
    except Exception as e:
        print(f"❌ Error syncing users: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("=" * 60)
    print("DATABASE INITIALIZATION - AUTHENTICATION SYSTEM")
    print("=" * 60)
    print("\n⚠️  WARNING: This will DELETE ALL EXISTING DATA!")
    print("Press Ctrl+C to cancel, or Enter to continue...")
    input()
    
    init_database()
    print("\n" + "=" * 60)
