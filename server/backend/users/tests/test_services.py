import pytest
from users.models import User, Instructor
from courses.models import Course
from quiz.models import Category
from users.views import LandingPageStatsService
from decouple import config

@pytest.mark.django_db
def test_landing_page_stats_service():
    # Create test users
    User.objects.create_user(username="student1", password=config("TEST_PASSWORD"), role="student")
    User.objects.create_user(username="student2", password=config("TEST_PASSWORD"), role="student")
    instructor = Instructor.objects.create(user=User.objects.create_user(username="instructor1", password=config("TEST_PASSWORD")))
    # Create test courses
    Course.objects.create(title="Course 1", description="Test", created_by=instructor, duration=5, difficulty="beginner", subject="Math")
    Course.objects.create(title="Course 2", description="Test", created_by=instructor, duration=8, difficulty="intermediate", subject="Science")

    # Create test quiz categories
    Category.objects.create(name="Category 1")
    Category.objects.create(name="Category 2")
    Category.objects.create(name="Category 3")

    # Call the service
    stats = LandingPageStatsService.get_landingpage_stats()

    # Assert the returned data
    assert stats["total_students"] == 2
    assert stats["total_courses"] == 2
    assert stats["total_quizzes"] == 3
