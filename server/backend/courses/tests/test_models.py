import pytest
from courses.models import Course, CourseContents, Enrollment, Rating
from users.models import User, Instructor, Student
from decouple import config
from courses.models import Course
from django.core.exceptions import ValidationError

@pytest.mark.django_db
class TestCourseModel:

    def test_create_course(self):
        instructor = Instructor.objects.create(user=User.objects.create_user(username="inst1", password=config("TEST_PASSWORD")))
        course = Course.objects.create(
            title="Test Course",
            description="Test Description",
            created_by=instructor,
            duration=10,
            difficulty="beginner",
            subject="Math"
        )
        assert course.title == "Test Course"
        assert str(course) == "Test Course"


    def test_enrollment_unique_constraint(self):
        user = User.objects.create_user(username="student1", password=config("TEST_PASSWORD"))
        student = Student.objects.create(user=user)
        instructor = Instructor.objects.create(user=User.objects.create_user(username="inst3", password=config("TEST_PASSWORD")))
        course = Course.objects.create(
            title="Unique Course",
            description="Unique Desc",
            created_by=instructor,
            duration=5,
            difficulty="advanced",
            subject="Chemistry"
        )
        Enrollment.objects.create(course=course, student=student)

        with pytest.raises(Exception):
            Enrollment.objects.create(course=course, student=student)

    def test_rating_only_enrolled_students(self):
        user = User.objects.create_user(username="student2", password=config("TEST_PASSWORD"))
        student = Student.objects.create(user=user)
        instructor = Instructor.objects.create(user=User.objects.create_user(username="inst4", password=config("TEST_PASSWORD")))
        course = Course.objects.create(
            title="Rating Course",
            description="Rate Desc",
            created_by=instructor,
            duration=12,
            difficulty="beginner",
            subject="Biology"
        )

        # Not enrolled yet
        with pytest.raises(Exception):
            Rating.objects.create(course=course, user=user, rating=5)

        # Enroll and then rate
        Enrollment.objects.create(course=course, student=student)
        rating = Rating.objects.create(course=course, user=user, rating=4)

        assert rating.rating == 4
        assert str(rating) == f"{user.username} - {course.title} - {rating.rating}"


    def test_update_avg_rating(self):
        user1 = User.objects.create_user(username="student3", password=config("TEST_PASSWORD"))
        user2 = User.objects.create_user(username="student4", password=config("TEST_PASSWORD"))
        student1 = Student.objects.create(user=user1)
        student2 = Student.objects.create(user=user2)
        instructor = Instructor.objects.create(user=User.objects.create_user(username="inst5", password=config("TEST_PASSWORD")))
        course = Course.objects.create(
            title="Avg Rating Course",
            description="Avg Desc",
            created_by=instructor,
            duration=6,
            difficulty="intermediate",
            subject="English"
        )

        Enrollment.objects.create(course=course, student=student1)
        Enrollment.objects.create(course=course, student=student2)

        Rating.objects.create(course=course, user=user1, rating=3)
        Rating.objects.create(course=course, user=user2, rating=5)

        course.refresh_from_db()
        assert course.ratings == 4


@pytest.mark.django_db
class TestCourseContentsModel:

    @pytest.fixture
    def course(self):
        return Course.objects.create(
        title="Test Course",
        description="A sample course.",
        duration=60  # or any appropriate value
    )

    def test_valid_video_content(self, course):
        content = CourseContents(
            course=course,
            content_type='video',
            title='Intro Video',
            url='https://example.com/video.mp4',
            order=1
        )
        content.full_clean()  # Should not raise
        content.save()
        assert content.pk is not None

    def test_invalid_video_content_without_url(self, course):
        content = CourseContents(
            course=course,
            content_type='video',
            title='Missing Video URL',
            url='',
            order=1
        )
        with pytest.raises(ValidationError) as excinfo:
            content.full_clean()
        assert "Video content must have a URL." in str(excinfo.value)

    def test_valid_pdf_content(self, course):
        content = CourseContents(
            course=course,
            content_type='pdf',
            title='Lecture Notes',
            url='https://example.com/notes.pdf',
            order=2
        )
        content.full_clean()
        content.save()
        assert content.pk is not None

    def test_invalid_pdf_content_without_url(self, course):
        content = CourseContents(
            course=course,
            content_type='pdf',
            title='PDF without URL',
            url='',
            order=2
        )
        with pytest.raises(ValidationError) as excinfo:
            content.full_clean()
        assert "PDF content must include a url." in str(excinfo.value)

    def test_valid_article_content(self, course):
        content = CourseContents(
            course=course,
            content_type='article',
            title='Course Introduction',
            text_content='Welcome to the course!',
            order=3
        )
        content.full_clean()
        content.save()
        assert content.pk is not None

    def test_invalid_article_without_text(self, course):
        content = CourseContents(
            course=course,
            content_type='article',
            title='Empty Article',
            text_content='',
            order=3
        )
        with pytest.raises(ValidationError) as excinfo:
            content.full_clean()
        assert "Article text contents cannot be empty." in str(excinfo.value)
