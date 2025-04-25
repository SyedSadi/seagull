from rest_framework import serializers
from .models import Category, Question, Option, QuizAttempt, UserAnswer
from drf_writable_nested import WritableNestedModelSerializer

# ------------------- OPTION SERIALIZER -------------------
class OptionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)  # Make id optional

    class Meta:
        model = Option
        fields = ['id', 'text', 'is_correct']
        extra_kwargs = {
            'id': {'read_only': False, 'required': False}  # Make id optional and writable
        }

# ------------------- QUESTION SERIALIZER -------------------
class QuestionSerializer(WritableNestedModelSerializer):
    options = OptionSerializer(many=True)   # Nested serializer for question options

    class Meta:
        model = Question
        fields = ['id', 'category', 'text', 'options']

    def update(self, instance, validated_data):
        """
        Custom update logic to handle nested options:
        - Update existing options
        - Create new options
        - Delete removed options
        """
        options_data = validated_data.pop('options', [])
        
        # Update the question fields
        instance = super().update(instance, validated_data)
        
        # Keep track of existing options
        existing_options = {option.id: option for option in instance.options.all()}
        updated_options = []
        
        # Update or create options
        for option_data in options_data:
            option_id = option_data.get('id', None)
            
            if option_id and option_id in existing_options:
                # Update existing option
                option = existing_options[option_id]
                for attr, value in option_data.items():
                    setattr(option, attr, value)
                option.save()
                updated_options.append(option)
            else:
                # Create new option
                option = Option.objects.create(question=instance, **option_data)
                updated_options.append(option)
        
        # Delete options that weren't included in the update
        for option_id, option in existing_options.items():
            if option not in updated_options:
                option.delete()
        
        return instance

# ------------------- CATEGORY SERIALIZER ------------------
class CategorySerializer(serializers.ModelSerializer):
    question_count = serializers.IntegerField(read_only=True)    # Total number of questions in the category
    questions = QuestionSerializer(many=True, read_only=True, source='question_set')     # Nested questions

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'created_at', 'question_count', 'questions']

# ------------------- USER ANSWER SERIALIZER -------------------
class UserAnswerSerializer(serializers.ModelSerializer):
    question_text = serializers.CharField(source='question.text', read_only=True)   # Display question text
    selected_answer = serializers.CharField(source='selected_option.text', read_only=True)   # User's selected option
    correct_answer = serializers.SerializerMethodField()    # Correct option text

    class Meta:
        model = UserAnswer
        fields = ['id', 'question_text', 'selected_answer', 'correct_answer', 'is_correct']

    def get_correct_answer(self, obj):
        """
        Return the text of the correct option for this question.
        """
        correct_option = obj.question.options.filter(is_correct=True).first()
        return correct_option.text if correct_option else None

# ------------------- QUIZ ATTEMPT SERIALIZER -------------------
class QuizAttemptSerializer(serializers.ModelSerializer):
    answers = UserAnswerSerializer(many=True, read_only=True)   # Nested answers
    category_name = serializers.CharField(source='category.name', read_only=True)   # Category name
    total_questions = serializers.SerializerMethodField()   # Total number of questions in quiz
    correct_answers = serializers.SerializerMethodField()    # Number of correct answers
    incorrect_answers = serializers.SerializerMethodField()  # Number of incorrect answers

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
        """
        Return total number of questions in the quiz category.
        """
        return obj.category.question_count

    def get_correct_answers(self, obj):
        """
        Count number of correctly answered questions.
        """
        return obj.answers.filter(is_correct=True).count()

    def get_incorrect_answers(self, obj):
        """
        Count number of incorrectly answered questions.
        """
        return obj.answers.filter(is_correct=False).count()