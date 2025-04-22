import pytest
from django.contrib.auth import get_user_model
from quiz.models import Category, Question, Option, QuizAttempt, UserAnswer
from decouple import config

@pytest.mark.django_db
class TestQuizModels:

    def test_category_model(self):
        category = Category.objects.create(
            name="Math", 
            description="Math related questions")
        assert category.name == "Math"
        assert category.description == "Math related questions"
        assert str(category) == "Math"

    def test_question_model(self):
        category = Category.objects.create(
            name="Math", 
            description="Math related questions")
        question = Question.objects.create(
            category=category, 
            text="What is 2+2?")
        assert question.text == "What is 2+2?"
        assert question.category == category
        assert str(question) == "What is 2+2?"

    def test_option_model(self):
        category = Category.objects.create(
            name="Math", 
            description="Math related questions")
        question = Question.objects.create(
            category=category, 
            text="What is 2+2?")
        option = Option.objects.create(
            question=question, 
            text="4", 
            is_correct=True)
        assert option.text == "4"
        assert option.is_correct is True
        assert str(option) == "4"

    def test_quiz_attempt_model(self):
        User = get_user_model()
        user = User.objects.create_user(
            username="testuser", 
            password=config("TEST_PASSWORD"), 
            email="testuser@example.com"
        )
        category = Category.objects.create(
            name="Math", 
            description="Math related questions"
        )
        # Create 10 questions to match the expected count
        for i in range(10):
            Question.objects.create(
                category=category,
                text=f"Question {i + 1}"
            )
        quiz_attempt = QuizAttempt.objects.create(
            user=user,
            category=category,
            score=7,
            completed=True
        )
        assert quiz_attempt.user == user
        assert quiz_attempt.category == category
        assert quiz_attempt.score == 7
        assert quiz_attempt.completed is True
        assert quiz_attempt.category.question_count == 10
        expected_str = f"{user.username} - {category.name} - {quiz_attempt.score}/{quiz_attempt.category.question_count}"
        assert str(quiz_attempt) == expected_str

    def test_user_answer_model(self):
        User = get_user_model()
        user = User.objects.create_user(
            username="testuser", 
            password=config("TEST_PASSWORD"), 
            email="testuser@example.com")
        category = Category.objects.create(
            name="Math", 
            description="Math related questions")
        question = Question.objects.create(
            category=category, 
            text="What is 2+2?")
        option = Option.objects.create(
            question=question, 
            text="4", 
            is_correct=True)
        quiz_attempt = QuizAttempt.objects.create(
            user=user, 
            category=category, 
            score=7, 
            completed=True)
        user_answer = UserAnswer.objects.create(
            attempt=quiz_attempt, 
            question=question, 
            selected_option=option, 
            is_correct=True)
        assert user_answer.attempt == quiz_attempt
        assert user_answer.question == question
        assert user_answer.selected_option == option
        assert user_answer.is_correct is True
        expected_str= "What is 2+2?"[:30] + " - Correct"
        assert str(user_answer) == expected_str