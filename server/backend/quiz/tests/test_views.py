import pytest
from rest_framework.test import APIClient
from rest_framework import status
from users.models import User
from quiz.models import Category, Question, Option, QuizAttempt, UserAnswer

@pytest.mark.django_db
class TestQuizViews:

    client = APIClient()

    def test_category_view_set(self):
        category = Category.objects.create(name="Math", description="Math questions")
        response = self.client.get(f'/quiz/')
        assert response.status_code == status.HTTP_200_OK

    def test_quiz_api_view(self):
        category = Category.objects.create(name="Math", description="Math questions")
        question1 = Question.objects.create(category=category, text="What is 2+2?")
        question2 = Question.objects.create(category=category, text="What is 3+3?")
        Option.objects.create(question=question1, text="4", is_correct=True)
        Option.objects.create(question=question2, text="6", is_correct=True)

        response = self.client.get(f'/quiz/{category.id}/')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['questions']) == 2

    def test_add_quiz_view(self):
        user = User.objects.create_superuser(username="testuser", password="password123")
        category_data = {"name": "Math", "description": "Math related questions"}
        self.client.force_authenticate(user=user)
        response = self.client.post('/quiz/add/', category_data, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['name'] == "Math"

    def test_add_question_view(self):
        user = User.objects.create_superuser(username="testuser", password="password123")
        category = Category.objects.create(name="Math", description="Math related questions")
        payload = {
            "category": category.id,
            "text": "What is the capital of France?",
            "options": [
                {"text": "Paris", "is_correct": True},
                {"text": "London", "is_correct": False},
                {"text": "Berlin", "is_correct": False},
                {"text": "Rome", "is_correct": False}
            ]
        }
        self.client.force_authenticate(user=user)
        response = self.client.post('/quiz/add-question/', payload, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['text'] == "What is the capital of France?"

    def test_delete_quiz_view(self):
        user = User.objects.create_superuser(username="testuser", password="password123")
        category = Category.objects.create(name="Math", description="Math questions")
        self.client.force_authenticate(user=user)
        response = self.client.delete('/quiz/delete/', data={"category_ids": [category.id]}, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert "categories" in response.data["message"]

    def test_update_quiz_view(self):
        user = User.objects.create_superuser(username="testuser", password="password123")
        category = Category.objects.create(name="Math", description="Math related questions")
        updated_data = {"name": "Advanced Math"}
        self.client.force_authenticate(user=user)
        response = self.client.put(f'/quiz/update/{category.id}/', updated_data, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['name'] == "Advanced Math"

    def test_submit_quiz_view(self):
        user = User.objects.create_user(username="testuser", password="password123")
        category = Category.objects.create(name="Math", description="Math related questions")
        question = Question.objects.create(category=category, text="What is 2+2?")
        option = Option.objects.create(question=question, text="4", is_correct=True)
        data = {"category_id": category.id, "answers": {str(question.id): option.id}}
        self.client.force_authenticate(user=user)
        response = self.client.post('/quiz/submit-quiz/', data, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['score'] == 1
        assert response.data['total'] == 1
