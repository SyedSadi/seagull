from rest_framework import serializers
from .models import Category, Question, Option, QuizAttempt, UserAnswer

class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['id', 'text', 'is_correct']

class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True)

    class Meta:
        model = Question
        fields = ['id', 'category', 'text', 'options']

    def create(self, validated_data):
        options_data = validated_data.pop('options')
        question = Question.objects.create(**validated_data)
        
        # Ensure at least one correct answer
        has_correct = False
        for option_data in options_data:
            option = Option.objects.create(question=question, **option_data)
            if option.is_correct:
                has_correct = True
        
        if not has_correct:
            question.delete()
            raise serializers.ValidationError(
                {"options": "At least one option must be marked as correct"}
            )
        
        return question

class CategorySerializer(serializers.ModelSerializer):
    question_count = serializers.IntegerField(read_only=True)
    questions = QuestionSerializer(many=True, read_only=True, source='question_set')

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'created_at', 'question_count', 'questions']

class UserAnswerSerializer(serializers.ModelSerializer):
    question_text = serializers.CharField(source='question.text', read_only=True)
    selected_answer = serializers.CharField(source='selected_option.text', read_only=True)
    correct_answer = serializers.SerializerMethodField()

    class Meta:
        model = UserAnswer
        fields = ['id', 'question_text', 'selected_answer', 'correct_answer', 'is_correct']

    def get_correct_answer(self, obj):
        correct_option = obj.question.options.filter(is_correct=True).first()
        return correct_option.text if correct_option else None

class QuizAttemptSerializer(serializers.ModelSerializer):
    answers = UserAnswerSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    total_questions = serializers.SerializerMethodField()
    correct_answers = serializers.SerializerMethodField()
    incorrect_answers = serializers.SerializerMethodField()

    class Meta:
        model = QuizAttempt
        fields = [
            'id', 
            'user', 
            'category',
            'category_name', 
            'score',
            'completed',
            'started_at',
            'completed_at',
            'total_questions',
            'correct_answers',
            'incorrect_answers',
            'answers'
        ]

    def get_total_questions(self, obj):
        return obj.category.question_count

    def get_correct_answers(self, obj):
        return obj.answers.filter(is_correct=True).count()

    def get_incorrect_answers(self, obj):
        return obj.answers.filter(is_correct=False).count()