from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from typing import ClassVar
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from .models import Category, Question, Option, QuizAttempt, UserAnswer
from .serializers import CategorySerializer, QuestionSerializer, QuizAttemptSerializer
from rest_framework.request import Request

# ---------------------- CATEGORY VIEWSET ----------------------
# Allows anyone to list or retrieve categories
class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes=[AllowAny]
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

# ---------------------- GET RANDOM QUIZ ----------------------
class QuizAPIView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, category_id):
        # Validate category_id
        try:
            category_id = int(category_id)
        except (TypeError, ValueError):
            return Response(
                {'error': 'Invalid category ID'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        category = get_object_or_404(Category, pk=category_id)
        # Get 20 random questions for the category
        questions = Question.objects.filter(category=category).order_by('?')[:20]
        # Serialize the questions
        serializer = QuestionSerializer(questions, many=True)
        
        return Response({
            'category_id': category.id,
            'category_name': category.name,
            'questions': serializer.data
        })

# ---------------------- ADMIN: ADD CATEGORY ----------------------
# Allows only admin users to add new categories
class AddQuizView(APIView):
    permission_classes=[IsAuthenticated, IsAdminUser]

    def post(self, request):
        serializer = CategorySerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ---------------------- ADMIN: ADD QUESTION ----------------------   
# Allows only admin users to add new questions 
class AddQuestionView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request):
        serializer =QuestionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ---------------------- ADMIN: UPDATE QUIZ ----------------------
# Allows only admin users to update existing categories     
class UpdateQuizView(APIView):
    permission_classes: ClassVar = [IsAuthenticated, IsAdminUser]

    def put(self, request: Request, category_id: int) -> Response:
        category = get_object_or_404(Category, id=category_id)
        serializer = CategorySerializer(category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ---------------------- ADMIN: UPDATE QUESTION ----------------------
class UpdateQuestionView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def put(self, request, question_id):
        # Get question
        question = get_object_or_404(Question, id=question_id)
        
        # Validate at least one correct option exists
        options_data = request.data.get('options', [])
        if options_data and not any(opt.get('is_correct', False) for opt in options_data):
            return Response(
                {"options": "At least one option must be marked as correct"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = QuestionSerializer(
            instance=question,
            data=request.data,
            partial=True
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# ---------------------- ADMIN: DELETE QUIZ ----------------------
class DeleteQuizView(APIView):
    permission_classes: ClassVar = [IsAuthenticated, IsAdminUser]

    def delete(self, request: Request) -> Response:
         # Get category IDs to delete
        category_ids = request.data.get('category_ids', [])
        if not category_ids:
            return Response({"message": "No categories specified."}, status=status.HTTP_400_BAD_REQUEST)
            
        # Delete all related questions and options first
        questions = Question.objects.filter(category_id__in=category_ids)
        Option.objects.filter(question__in=questions).delete()
        questions.delete()
                
        # Delete the categories
        deleted_count = Category.objects.filter(id__in=category_ids).delete()[0]
        return Response({"message": f"{deleted_count} categories and their associated data deleted."}, status=status.HTTP_200_OK)
    

# ---------------------- ADMIN: DELETE QUESTION ----------------------
class DeleteQuestionView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def delete(self, request, question_id):
        #Get question IDs to delete
        question= get_object_or_404(Question, id=question_id)
        question.delete()
        return Response({"message": "Question deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


# ---------------------- USER: SUBMIT QUIZ ----------------------    
class SubmitQuizAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        category_id = request.data.get('category_id')
        answers = request.data.get('answers', {})
        
        if not category_id:
            return Response({'error': 'Category ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        category = get_object_or_404(Category, pk=category_id)
        
        # Create quiz attempt
        quiz_attempt = QuizAttempt.objects.create(
            user=request.user,
            category=category,
            score=0,
            completed=True,
            completed_at=timezone.now()
        )
        
        # Get all questions from the category that were in the quiz
        question_ids = list(answers.keys())
        questions = Question.objects.filter(id__in=question_ids)
        total_questions = len(questions)
        
        correct_answers = 0
        incorrect_answers = 0
        unanswered = total_questions - len(answers)
        
        # Process user answers
        questions_data = []
        
        for question in questions:
            question_id = str(question.id)
            selected_option_id = answers.get(question_id)
            
            if selected_option_id:
                selected_option = get_object_or_404(Option, pk=selected_option_id)
                is_correct = selected_option.is_correct
                
                if is_correct:
                    correct_answers += 1
                else:
                    incorrect_answers += 1
                
                # Save user answer
                UserAnswer.objects.create(
                    attempt=quiz_attempt,
                    question=question,
                    selected_option=selected_option,
                    is_correct=is_correct
                )
                
                # Prepare question data for results
                questions_data.append({
                    'text': question.text,
                    'your_answer': selected_option.text,
                    'correct_answer': question.options.filter(is_correct=True).first().text,
                    'is_correct': is_correct
                })
            else:
                # No answer provided
                questions_data.append({
                    'text': question.text,
                    'your_answer': None,
                    'correct_answer': question.options.filter(is_correct=True).first().text,
                    'is_correct': False
                })
        
        # Update quiz attempt score
        quiz_attempt.score = correct_answers
        quiz_attempt.save()
        
        return Response({
            'category_id': category.id,
            'score': correct_answers,
            'total': total_questions,
            'correct_answers': correct_answers,
            'incorrect_answers': incorrect_answers,
            'unanswered': unanswered,
            'questions': questions_data
        }, status=status.HTTP_200_OK)


# ---------------------- USER: QUIZ HISTORY ----------------------
class QuizAttemptsView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self, request):
        #Get all attempts for current user
        attempts=QuizAttempt.objects.filter(
            user=request.user,
            completed=True
        ).order_by('-completed_at') #sorted by most recent

        serializer=QuizAttemptSerializer(attempts, many=True)
        return Response(serializer.data)