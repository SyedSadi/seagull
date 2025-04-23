import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from courses.models import Course
from users.models import User
from decouple import config


@pytest.mark.django_db
def test_invoice_download_view_generates_pdf():
    # Create test user
    user = User.objects.create_user(username='testuser', password=config('TEST_PASSWORD'), email='test@example.com')

    # Create test course
    course = Course.objects.create(
        title='Python Basics',
        subject='Programming',
        difficulty='Beginner',
        duration=10
    )

    # Log in as user
    client = APIClient()
    client.login(username='testuser', password=config('TEST_PASSWORD'))

    # Endpoint
    client = APIClient()
    client.force_authenticate(user=user)
    response = client.get(f'/courses/invoice/{course.id}/')

    # Assertions
    assert response.status_code == 200
    assert response['Content-Type'] == 'application/pdf'
    assert f'filename="invoice_{course.title}_{user.username}.pdf"' in response['Content-Disposition']
    assert len(response.content) > 0  # PDF content should not be empty
