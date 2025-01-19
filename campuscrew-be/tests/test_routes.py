import pytest
from unittest.mock import patch, MagicMock
from app.api.routes import api
import random


@pytest.fixture
def client():
    from flask import Flask
    app = Flask(__name__)
    app.register_blueprint(api)
    app.config['TESTING'] = True
    client = app.test_client()
    yield client


@pytest.fixture
def mock_users():
    with patch('app.models.Users') as mock_users:
        yield mock_users

email = 'test'+str(random.randint(1,1000000))+'@email.com'

@pytest.fixture(scope="module")
def data_storage():
    data = {}
    return data

def test_create_user_success(client, mock_users, data_storage):
    mock_users.find_by_email.return_value = None
    mock_users.create_user.return_value = ({"id": 1}, None)

    response = client.post('/createUser', json={
        "firstName": "John",
        "lastName": "Doe",
        "email": email,
        "password": "password123",
        "isPfw": True
    })
    
    assert response.status_code == 201
    data = response.get_json()
    data_storage["user_id"] = data["user_id"]
    assert data["message"] == "User created successfully"


def test_create_user_email_already_exists(client, mock_users):
    mock_users.find_by_email.return_value = {"email": email}
    response = client.post('/createUser', json={
        "firstName": "John",
        "lastName": "Doe",
        "email": email,
        "password": "password123",
        "isPfw": True
    })
    assert response.status_code == 400
    data = response.get_json()
    assert data["error"] == "Email is already in use"


def test_login_success(client, mock_users):
    mock_users.find_by_email.return_value = {"email": email, "password": "hashed_password"}
    mock_users.check_password.return_value = True

    response = client.post('/login', json={
        "email": email,
        "password": "password123"
    })
    assert response.status_code == 200
    data = response.get_json()
    assert data["message"] == "Login successful"


def test_login_user_not_found(client, mock_users):
    mock_users.find_by_email.return_value = None
    response = client.post('/login', json={
        "email": "test1@example.com",
        "password": "password123"
    })
    assert response.status_code == 400
    data = response.get_json()
    assert data["error"] == "User not found"

def test_create_service_success(client, data_storage):
    with patch('app.models.Services') as mock_services:
        mock_services.create_service.return_value = ("123", None)
        
        response = client.post('/createService', json={
            "name": "Test Service",
            "description": "Test description",
            "rate": 10,
            "category_id": 1,
            "user_id": data_storage["user_id"],
            "image_urls": [
                "https://example.com/image1.jpg",
                "https://example.com/image2.jpg"
            ],
            "availability": [
                {
                    "max_hrs": 1,
                    "avail_slots": ["2024-11-21 09:00:00", "2024-11-22 09:00:00", "2024-11-23 09:00:00"]
                }]
        })
        print(response.get_json())
        assert response.status_code == 201
        data = response.get_json()
        assert data["message"] == "Service created successfully"


def test_create_service_missing_fields(client):
    response = client.post('/createService', json={
        "name": "Test Service",
        "description": "Test description"
    })
    assert response.status_code == 400
    data = response.get_json()
    assert data["error"] == "Missing required fields"


def test_fetch_services_success(client):
    with patch('app.models.Services') as mock_services:
        mock_services.get_all_services.return_value = ([{"service_id": "123"}], None)
        response = client.get('/fetchService')
        assert response.status_code == 200
        data = response.get_json()
        assert data["message"] == "Services fetched successfully"