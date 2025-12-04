import pytest
from httpx import AsyncClient
from main import app
from schemas import LoginRequestSchema
from db.database import SessionLocal
from models.user import UserModel
import bcrypt
import uuid

# Setup a test user in the database
@pytest.fixture(scope="module")
def test_user():
    db = SessionLocal()
    password = "password123"
    hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    user = UserModel(
        id=uuid.uuid4(),
        username="testuser",
        email="test@example.com",
        password=hashed_password,
        first_name="Test",
        last_name="User",
        is_active=True
    )
    db.add(user)
    db.commit()
    yield user
    db.delete(user)
    db.commit()
    db.close()


@pytest.mark.asyncio
async def test_login_success(test_user):
    async with AsyncClient(app=app, base_url="http://testserver") as client:
        payload = {"username": "testuser", "password": "password123"}
        response = await client.post("/auth/login", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_login_fail_wrong_password(test_user):
    async with AsyncClient(app=app, base_url="http://testserver") as client:
        payload = {"username": "testuser", "password": "wrongpassword"}
        response = await client.post("/auth/login", json=payload)
        assert response.status_code == 401
        data = response.json()
        assert data["detail"] == "Invalid credentials"


@pytest.mark.asyncio
async def test_login_fail_user_not_found():
    async with AsyncClient(app=app, base_url="http://testserver") as client:
        payload = {"username": "nouser", "password": "any"}
        response = await client.post("/auth/login", json=payload)
        assert response.status_code == 401
        data = response.json()
        assert data["detail"] == "Invalid credentials"
