import pytest
from quiz.serializers import (
    CategorySerializer, 
    QuestionSerializer, 
    OptionSerializer,
    QuizAttemptSerializer
)
from quiz.models import Category, Question, Option, QuizAttempt, UserAnswer
from users.models import User
from django.utils import timezone

@pytest.mark.django_db
class TestSerializers:
    def test_category_serializer(self):
        category_data = {
            "name": "Mathematics",
            "description": "Math related questions"
        }
        serializer = CategorySerializer(data=category_data)
        assert serializer.is_valid()
        category = serializer.save()
        assert category.name == "Mathematics"

    def test_option_serializer(self):
        # Create required related objects
        category = Category.objects.create(name="Math")
        question = Question.objects.create(
            category=category,
            text="What is 2+2?"
        )

        # Test serializer validation for new option
        option_data = {
            "text": "Four",
            "is_correct": True
        }
        
        serializer = OptionSerializer(data=option_data)
        valid = serializer.is_valid()
        assert valid, f"Serializer errors: {serializer.errors}"

        # Test option creation
        option = serializer.save(question=question)
        assert option.text == "Four"
        assert option.is_correct is True
        assert option.question == question

    def test_question_serializer_create(self):
        # Create category first
        category = Category.objects.create(name="Math")
        
        question_data = {
            "text": "What is 2+2?",
            "category": category.id,
            "options": [
                {"text": "Four", "is_correct": True},
                {"text": "Three", "is_correct": False},
                {"text": "Five", "is_correct": False}
            ]
        }
        
        serializer = QuestionSerializer(data=question_data)
        valid = serializer.is_valid()
        assert valid, f"Serializer errors: {serializer.errors}"
        
        question = serializer.save()
        
        # Verify the question was created correctly
        assert question.text == "What is 2+2?"
        assert question.category == category
        
        # Verify options were created correctly
        options = question.options.all()
        assert options.count() == 3
        assert options.filter(is_correct=True).count() == 1
        assert options.filter(text="Four", is_correct=True).exists()

    def test_question_serializer_update(self):
        # Create initial data
        category = Category.objects.create(name="Math")
        question = Question.objects.create(
            category=category,
            text="What is 2+2?"
        )
        option = Option.objects.create(
            question=question,
            text="Four",
            is_correct=True
        )

        # Update data
        update_data = {
            "text": "What is 3+3?",
            "category": category.id,
            "options": [
                {"id": option.id, "text": "Six", "is_correct": True},
                {"text": "Seven", "is_correct": False}
            ]
        }

        serializer = QuestionSerializer(
            instance=question,
            data=update_data,
            partial=True
        )
        valid = serializer.is_valid()
        assert valid, f"Serializer errors: {serializer.errors}"
        
        updated_question = serializer.save()
        
        # Verify the update was successful
        assert updated_question.text == "What is 3+3?"
        assert updated_question.options.count() == 2
        assert updated_question.options.filter(text="Six", is_correct=True).exists()
        assert updated_question.options.filter(text="Seven", is_correct=False).exists()