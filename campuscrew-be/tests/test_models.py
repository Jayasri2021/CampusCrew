import pytest
from unittest.mock import patch, MagicMock
from app.models import Users, Services, Bookings


@pytest.fixture
def mock_supabase():
    with patch('app.models.supabase') as mock_supabase:
        yield mock_supabase


def test_create_user_success(mock_supabase):
    mock_supabase.table.return_value.insert.return_value.execute.return_value = MagicMock(data=[{"id": 1}])
    user_data, error = Users.create_user(
        email="test@example.com", 
        password="password123", 
        first_name="John", 
        last_name="Doe", 
        user_id="123", 
        is_pfw=True
    )
    assert user_data is not None
    assert error is None


def test_create_user_failure(mock_supabase):
    mock_supabase.table.return_value.insert.return_value.execute.return_value = MagicMock(data=None)
    user_data, error = Users.create_user(
        email="test@example.com", 
        password="password123", 
        first_name="John", 
        last_name="Doe", 
        user_id="123", 
        is_pfw=True
    )
    assert user_data is None
    assert "Failed to create user" in error


def test_find_by_email_success(mock_supabase):
    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value = MagicMock(data=[{"email": "test@example.com"}])
    user = Users.find_by_email("test@example.com")
    assert user["email"] == "test@example.com"


def test_find_by_email_not_found(mock_supabase):
    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value = MagicMock(data=[])
    user = Users.find_by_email("test@example.com")
    assert user is None


def test_check_password():
    user = {"password": "pbkdf2:sha256:150000$hashedvalue"}
    assert Users.check_password(user, "password123") is False


def test_create_service_success(mock_supabase):
    mock_supabase.table.return_value.insert.return_value.execute.return_value = MagicMock(data=[{"service_id": "123"}])
    service_id, error = Services.create_service(
        name="Test Service", 
        description="A simple service", 
        rate=10.0, 
        category_id="1", 
        user_id="123"
    )
    assert service_id is not None
    assert error is None


def test_create_service_failure(mock_supabase):
    mock_supabase.table.return_value.insert.return_value.execute.return_value = MagicMock(data=None, error=MagicMock(message="Service failed"))
    service_id, error = Services.create_service(
        name="Test Service", 
        description="A simple service", 
        rate=10.0, 
        category_id="1", 
        user_id="123"
    )
    assert service_id is None
    assert "Service failed" in error


def test_get_all_services_success(mock_supabase):
    mock_supabase.table.return_value.select.return_value.execute.return_value = MagicMock(data=[{"service_id": "123"}])
    services, error = Services.get_all_services()
    assert services is not None
    assert error is None


def test_get_all_services_failure(mock_supabase):
    mock_supabase.table.return_value.select.return_value.execute.side_effect = Exception("Failed to fetch services")
    services, error = Services.get_all_services()
    assert services is None
    assert "Failed to fetch services" in error
