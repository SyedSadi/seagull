import pytest
from users.models import Instructor, Student, User

@pytest.mark.django_db
class TestUserModel:
    def test_user_creation(self):
        user = User.objects.create_user(username="testuser", password="password123", role="student")
        assert user.username == "testuser"
        assert user.role == "student"
        assert user.check_password("password123")

    def test_user_str(self):
        user = User.objects.create_user(username="testuser", password="password123", role="student")
        print(f"Created user with id: {user.id}")
        assert str(user) == "testuser"


@pytest.mark.django_db
class TestInstructorModel:
    def test_instructor_creation(self):
        user = User.objects.create_user(username="test_instructor", password="password123", role="instructor")
        instructor = Instructor.objects.create(user=user, designation="Professor", university="MIT")
        
        assert instructor.user.username == "test_instructor"
        assert instructor.designation == "Professor"
        assert instructor.university == "MIT"

#     def test_instructor_str(self):
#         # Ensure no previous instructor exists
#         Instructor.objects.all().delete()

#         user = get_user_model().objects.create_user(
#             username="instructor1", password="password123", role="instructor"
#         )
#         instructor = Instructor.objects.create(
#             user=user, designation="Professor", university="ABC University"
#         )
#         assert str(instructor) == "instructor1"


# @pytest.mark.django_db
# class TestStudentModel:
#     def test_student_creation(self):
#         # Ensure no previous student exists
#         Student.objects.all().delete()

#         user = get_user_model().objects.create_user(
#             username="student1", password="password123", role="student"
#         )
#         student = Student.objects.create(
#             user=user, course_completed=3, course_enrolled=5
#         )
#         assert student.user.username == "student1"
#         assert student.course_completed == 3
#         assert student.course_enrolled == 5

#     def test_student_str(self):
#         # Ensure no previous student exists
#         Student.objects.all().delete()

#         user = get_user_model().objects.create_user(
#             username="student1", password="password123", role="student"
#         )
#         student = Student.objects.create(
#             user=user, course_completed=3, course_enrolled=5
#         )
#         assert str(student) == "student1"
