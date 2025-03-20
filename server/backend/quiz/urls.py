from django.urls import path
from .views import CategoryViewSet, QuizAPIView, SubmitQuizAPIView



urlpatterns = [
    path('', CategoryViewSet.as_view({'get': 'list'}), name='category'),
    path('quiz/<int:category_id>/', QuizAPIView.as_view(), name='quiz'),
    path('submit-quiz/', SubmitQuizAPIView.as_view(), name='submit-quiz'),
]