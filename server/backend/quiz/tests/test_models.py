import pytest
from django.contrib.auth import get_user_model
from quiz.models import Category, Question, Option, QuizAttempt, UserAnswer
from decouple import config

@pytest.mark.django_db
class TestQuizModels:

    def test_category_model(self):
        category = Category.objects.create(name="Math", description="Math related questions")
        assert category.name == "Math"
        assert category.description == "Math related questions"

    def test_question_model(self):
        category = Category.objects.create(name="Math", description="Math related questions")
        question = Question.objects.create(category=category, text="What is 2+2?")
        assert question.text == "What is 2+2?"
        assert question.category == category

    def test_option_model(self):
        category = Category.objects.create(name="Math", description="Math related questions")
        question = Question.objects.create(category=category, text="What is 2+2?")
        option = Option.objects.create(question=question, text="4", is_correct=True)
        assert option.text == "4"
        assert option.is_correct is True

    def test_quiz_attempt_model(self):
        User = get_user_model()
        user = User.objects.create_user(username="testuser", password=config("TEST_PASSWORD"), email="testuser@example.com")
        category = Category.objects.create(name="Math", description="Math related questions")
        quiz_attempt = QuizAttempt.objects.create(user=user, category=category, score=80, completed=True)
        assert quiz_attempt.user == user
        assert quiz_attempt.category == category
        assert quiz_attempt.score == 80
        assert quiz_attempt.completed is True

    def test_user_answer_model(self):
        User = get_user_model()
        user = User.objects.create_user(username="testuser", password=config("TEST_PASSWORD"), email="testuser@example.com")
        category = Category.objects.create(name="Math", description="Math related questions")
        question = Question.objects.create(category=category, text="What is 2+2?")
        option = Option.objects.create(question=question, text="4", is_correct=True)
        quiz_attempt = QuizAttempt.objects.create(user=user, category=category, score=80, completed=True)
        user_answer = UserAnswer.objects.create(attempt=quiz_attempt, question=question, selected_option=option, is_correct=True)
        assert user_answer.attempt == quiz_attempt
        assert user_answer.question == question
        assert user_answer.selected_option == option
        assert user_answer.is_correct is True