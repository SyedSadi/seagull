from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, QuizAPIView, SubmitQuizAPIView

router = DefaultRouter()
router.register(r'quiz', CategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('quiz/<int:category_id>/', QuizAPIView.as_view(), name='quiz'),
    path('submit-quiz/', SubmitQuizAPIView.as_view(), name='submit-quiz'),
]