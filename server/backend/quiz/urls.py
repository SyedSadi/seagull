from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, QuizAPIView, SubmitQuizAPIView

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/quiz/<int:category_id>/', QuizAPIView.as_view(), name='quiz'),
    path('api/submit-quiz/', SubmitQuizAPIView.as_view(), name='submit-quiz'),
]