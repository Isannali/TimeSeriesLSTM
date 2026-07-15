import pytest
from fastapi.testclient import TestClient
from app.main import app 
@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c
def test_api_health(client):
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "core" in data