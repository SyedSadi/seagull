import pytest
from rest_framework.test import APIClient
from rest_framework import status
from users.models import User
from quiz.models import Category, Question, Option, QuizAttempt, UserAnswer
from decouple import config
from django.utils import timezone

@pytest.mark.django_db
class TestQuizViews:

    client = APIClient()

    def test_category_view_set(self):
        category = Category.objects.create(
            name="Math", 
            description="Math questions")
        response = self.client.get(f'/quiz/')
        assert response.status_code == status.HTTP_200_OK

    def test_quiz_api_view(self):
        #create category
        category = Category.objects.create(
            name="Math", 
            description="Math questions")
        #create auestions
        question1 = Question.objects.create(
            category=category, 
            text="What is 2+2?")
        question2 = Question.objects.create(
            category=category, 
            text="What is 3+3?")
        #create options
        Option.objects.create(
            question=question1, 
            text="4", 
            is_correct=True)
        Option.objects.create(
            question=question2, 
            text="6", 
            is_correct=True)

        # Test successful response
        response = self.client.get(f'/quiz/{category.id}/')
        assert 'questions' in response.data
        assert len(response.data['questions']) == 2
        assert response.data['category_id'] == category.id
        assert response.data['category_name'] == category.name

        # Test non-existent numeric ID
        response = self.client.get('/quiz/999/')
        assert response.status_code == status.HTTP_404_NOT_FOUND

        # Test invalid ID format
        response = self.client.get('/quiz/abc/')
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_add_quiz_view(self):
        user = User.objects.create_superuser(
            username="testuser", 
            password=config("TEST_PASSWORD"))
        category_data = {"name": "Math", "description": "Math related questions"}
        self.client.force_authenticate(user=user)
        response = self.client.post('/quiz/add/', category_data, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['name'] == "Math"

        invalid_data = {
        "description": "Missing name field"
        }
        response = self.client.post('/quiz/add/', invalid_data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'name' in response.data

    def test_add_question_view(self):
        # Create admin user and authenticate
        user = User.objects.create_superuser(
            username="testuser", 
            password=config("TEST_PASSWORD")
        )
        self.client.force_authenticate(user=user)

        # Create category first
        category = Category.objects.create(
            name="Math", 
            description="Math related questions"
        )

        # Valid payload with all required fields
        valid_payload = {
            "text": "What is the capital of France?",
            "category": category.id,
            "options": [
                {"text": "Paris", "is_correct": True},
                {"text": "London", "is_correct": False},
                {"text": "Berlin", "is_correct": False},
                {"text": "Rome", "is_correct": False}
            ]
        }

        # Test with valid data
        response = self.client.post(
            '/quiz/add-question/', 
            valid_payload, 
            format='json'
        )
        assert response.status_code == status.HTTP_201_CREATED
        assert Question.objects.count() == 1
        assert Option.objects.count() == 4

        # Test with invalid data - missing options
        invalid_payload = {
            "text": "Invalid question",
            "category": category.id
        }
        response = self.client.post(
            '/quiz/add-question/', 
            invalid_payload, 
            format='json'
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_delete_quiz_view(self):
        user = User.objects.create_superuser(username="testuser", password=config("TEST_PASSWORD"))
        category = Category.objects.create(name="Math", description="Math questions")
        self.client.force_authenticate(user=user)
        response = self.client.delete('/quiz/delete/', data={"category_ids": [category.id]}, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert "categories" in response.data["message"]

    def test_update_quiz_view(self):
        user = User.objects.create_superuser(username="testuser", password=config("TEST_PASSWORD"))
        category = Category.objects.create(name="Math", description="Math related questions")
        updated_data = {"name": "Advanced Math"}
        self.client.force_authenticate(user=user)
        response = self.client.put(f'/quiz/update/{category.id}/', updated_data, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['name'] == "Advanced Math"

    def test_submit_quiz_view(self):
        user = User.objects.create_user(username="testuser", password=config("TEST_PASSWORD"))
        category = Category.objects.create(name="Math", description="Math related questions")
        question = Question.objects.create(category=category, text="What is 2+2?")
        option = Option.objects.create(question=question, text="4", is_correct=True)
        data = {"category_id": category.id, "answers": {str(question.id): option.id}}
        self.client.force_authenticate(user=user)
        response = self.client.post('/quiz/submit-quiz/', data, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['score'] == 1
        assert response.data['total'] == 1

    def test_quiz_attempts_view(self):
        """Test retrieving quiz attempts for a user"""
        # Create test user and authenticate
        user = User.objects.create_user(username="testuser", password=config("TEST_PASSWORD"))
        self.client.force_authenticate(user=user)

        # Create category and questions
        category = Category.objects.create(name="Math", description="Math questions")
        question = Question.objects.create(category=category, text="What is 2+2?")
        option = Option.objects.create(question=question, text="4", is_correct=True)

        # Create quiz attempts
        quiz_attempt = QuizAttempt.objects.create(
            user=user,
            category=category,
            score=1,
            completed=True,
            completed_at=timezone.now()
        )
        UserAnswer.objects.create(
            attempt=quiz_attempt,
            question=question,
            selected_option=option,
            is_correct=True
        )

        # Test getting attempts
        response = self.client.get('/quiz/attempts/')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]['score'] == 1
        assert response.data[0]['category'] == category.id

    def test_update_question_view(self):
        """Test updating question details"""
        # Create admin user and authenticate
        user = User.objects.create_superuser(username="testadmin", password=config("TEST_PASSWORD"))
        self.client.force_authenticate(user=user)

        # Create category and question
        category = Category.objects.create(name="Math", description="Math questions")
        question = Question.objects.create(category=category, text="What is 2+2?")
        option = Option.objects.create(question=question, text="4", is_correct=True)

        # Test updating question text only
        updated_data = {
            "text": "What is 3+3?",
            "category": category.id
        }
        response = self.client.put(
            f'/quiz/update-questions/{question.id}/',
            updated_data,
            format='json'
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.data['text'] == "What is 3+3?"

        # Test updating non-existent question
        response = self.client.put(
            '/quiz/update-questions/999/',
            updated_data,
            format='json'
        )
        assert response.status_code == status.HTTP_404_NOT_FOUND

        # Test with invalid data
        invalid_data = {"text": ""}
        response = self.client.put(
            f'/quiz/update-questions/{question.id}/',
            invalid_data,
            format='json'
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_unauthorized_access(self):
        """Test unauthorized access to admin-only endpoints"""
        # Create regular user
        user = User.objects.create_user(username="testuser", password=config("TEST_PASSWORD"))
        self.client.force_authenticate(user=user)

        # Try to access admin endpoints
        category = Category.objects.create(name="Math", description="Math questions")
        endpoints = [
            ('/quiz/add/', 'post'),
            ('/quiz/add-question/', 'post'),
            (f'/quiz/update/{category.id}/', 'put'),
            ('/quiz/delete/', 'delete')
        ]

        for endpoint, method in endpoints:
            if method == 'post':
                response = self.client.post(endpoint, {}, format='json')
            elif method == 'put':
                response = self.client.put(endpoint, {}, format='json')
            else:
                response = self.client.delete(endpoint)
            assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_quiz_submission_validation(self):
        """Test quiz submission with various scenarios"""
        user = User.objects.create_user(username="testuser", password=config("TEST_PASSWORD"))
        self.client.force_authenticate(user=user)
        category = Category.objects.create(name="Math", description="Math questions")
        question = Question.objects.create(category=category, text="What is 2+2?")
        correct_option = Option.objects.create(question=question, text="4", is_correct=True)
        wrong_option = Option.objects.create(question=question, text="5", is_correct=False)

        # Test with missing category_id
        response = self.client.post('/quiz/submit-quiz/', {}, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'error' in response.data

        # Test with non-existent category
        response = self.client.post('/quiz/submit-quiz/', 
            {'category_id': 999, 'answers': {}}, format='json')
        assert response.status_code == status.HTTP_404_NOT_FOUND

        # Test with correct answer
        response = self.client.post('/quiz/submit-quiz/', {
            'category_id': category.id,
            'answers': {str(question.id): correct_option.id}
        }, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['score'] == 1

        # Test with incorrect answer
        response = self.client.post('/quiz/submit-quiz/', {
            'category_id': category.id,
            'answers': {str(question.id): wrong_option.id}
        }, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['score'] == 0
