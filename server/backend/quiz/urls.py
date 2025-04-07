from django.urls import path
from .views import CategoryViewSet, QuizAPIView, SubmitQuizAPIView, AddQuizView, AddQuestionView, UpdateDeleteQuizView



urlpatterns = [
    path('', CategoryViewSet.as_view({'get': 'list'}), name='category'),
    path('<int:category_id>/', QuizAPIView.as_view(), name='quiz'),
    path('submit-quiz/', SubmitQuizAPIView.as_view(), name='submit-quiz'),
    path('add/', AddQuizView.as_view(), name='add_quiz'),
    path('add-question/', AddQuestionView.as_view(), name='add-question'),
    path('delete/', UpdateDeleteQuizView.as_view(), name='delete-quiz')
]