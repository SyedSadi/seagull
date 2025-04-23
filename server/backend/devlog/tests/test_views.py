import pytest
from django.urls import reverse

@pytest.mark.django_db
def test_home_page_renders_correct_template(client):
    """Test that the home page renders the correct template."""
    response = client.get(reverse('home'))  # Make sure you have the correct URL pattern name
    assert response.status_code == 200
    assert 'devlog/home.html' in [t.name for t in response.templates]


@pytest.mark.django_db
def test_about_page_renders_correct_template(client):
    """Test that the story page renders the correct template."""
    response = client.get(reverse('story'))  # Make sure you have the correct URL pattern name
    assert response.status_code == 200
    assert 'devlog/story.html' in [t.name for t in response.templates]