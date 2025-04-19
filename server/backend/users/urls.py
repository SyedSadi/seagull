from django.urls import path, include
from .views import InstructorViewSet, ProfileView

urlpatterns = [
    path('', ProfileView.as_view(), name='profile'),
    path('instructors/', InstructorViewSet.as_view({'get': 'list'}), name='all_instructors'),
]