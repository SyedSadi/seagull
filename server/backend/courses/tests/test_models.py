import pytest
from courses.models import Course, CourseContents, Enrollment, Rating
from users.models import User, Instructor, Student
from decouple import config

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

    
    def test_create_course_content(self):
        instructor = Instructor.objects.create(user=User.objects.create_user(username="inst2", password=config("TEST_PASSWORD")))
        course = Course.objects.create(
            title="Another Course",
            description="Another Description",
            created_by=instructor,
            duration=8,
            difficulty="intermediate",
            subject="Physics"
        )
        content = CourseContents.objects.create(
            course=course,
            content_type='video',
            title="Intro Video",
            url="https://example.com/video.mp4",
            text_content=""
        )
        assert content.title == "Intro Video"
        assert content.content_type == "video"
        assert str(content) == f"{content.title}/{content.content_type}"


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
