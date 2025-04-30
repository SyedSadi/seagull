from django.urls import path, include
from .views import InstructorViewSet, ProfileView, InstructorDetailView

urlpatterns = [
    path('', ProfileView.as_view(), name='profile'),
    path('instructors/', InstructorViewSet.as_view({'get': 'list'}), name='all_instructors'),
    path('instructors/<int:id>/', InstructorDetailView.as_view(), name='instructor-detail'),
]