from django.urls import path
from .views import CategoryViewSet, QuizAPIView, SubmitQuizAPIView, AddQuizView



urlpatterns = [
    path('', CategoryViewSet.as_view({'get': 'list'}), name='category'),
    path('add/', AddQuizView.as_view(), name='add_quiz'),
    path('<int:category_id>/', QuizAPIView.as_view(), name='quiz'),
    path('submit-quiz/', SubmitQuizAPIView.as_view(), name='submit-quiz'),
]