import pytest
from rest_framework.exceptions import ValidationError
from django.contrib.auth import get_user_model
from users.models import Instructor
from users.serializers import InstructorSerializer

User = get_user_model()

@pytest.fixture
def create_instructor():
    user = User.objects.create_user(username="john_doe", password="password123", role="instructor")
    return Instructor.objects.create(user=user, designation="Professor", university="ABC University")

@pytest.mark.django_db
def test_instructor_serializer(create_instructor):
    instructor = create_instructor
    serializer = InstructorSerializer(instructor)
    
    # Check that the name field correctly pulls from the user model
    assert serializer.data['name'] == instructor.user.username
    assert serializer.data['designation'] == instructor.designation
    assert serializer.data['university'] == instructor.university
    assert set(serializer.data.keys()) == {'id', 'name', 'designation', 'university'}

# @pytest.mark.django_db
# def test_instructor_serializer_invalid_data():
#     data = {
#         "name": "Jane Doe",  # name should be a read-only field, so this would be invalid
#         "designation": "Assistant Professor",
#         "university": "XYZ University"
#     }
#     serializer = InstructorSerializer(data=data)
#     with pytest.raises(ValidationError):
#         serializer.is_valid(raise_exception=True)
