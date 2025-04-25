import pytest
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.core import mail
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import PasswordResetTokenGenerator

User = get_user_model()

@pytest.mark.django_db
def test_request_password_reset_view(client):
    user = User.objects.create_user(username="testuser", email="test@example.com", password="testpass123")

    response = client.post(reverse("request-reset-password"), {"email": "test@example.com"})

    assert response.status_code == 200
    assert "message" in response.json()
    assert len(mail.outbox) == 1
    assert "reset-password" in mail.outbox[0].body


@pytest.mark.django_db
def test_request_password_reset_view_nonexistent_email(client):
    response = client.post(reverse("request-reset-password"), {"email": "fake@example.com"})

    assert response.status_code == 200
    assert "message" in response.json()
    assert len(mail.outbox) == 0


@pytest.mark.django_db
def test_password_reset_confirm_view(client):
    user = User.objects.create_user(username="testuser", email="test@example.com", password="oldpassword")
    uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
    token = PasswordResetTokenGenerator().make_token(user)
    new_password = "newsecurepassword"

    url = reverse("reset-password-confirm", kwargs={"uidb64": uidb64, "token": token})
    response = client.post(url, {"password": new_password})

    assert response.status_code == 200
    user.refresh_from_db()
    assert user.check_password(new_password)


@pytest.mark.django_db
def test_password_reset_confirm_view_invalid_token(client):
    user = User.objects.create_user(username="testuser", email="test@example.com", password="oldpassword")
    uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
    invalid_token = "invalid-token"
    new_password = "newsecurepassword"

    url = reverse("reset-password-confirm", kwargs={"uidb64": uidb64, "token": invalid_token})
    response = client.post(url, {"password": new_password})

    assert response.status_code == 400
    assert "error" in response.json()
