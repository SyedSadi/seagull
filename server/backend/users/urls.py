from django.urls import path, include
from .views import InstructorViewSet 

urlpatterns = [
    path('', InstructorViewSet.as_view({'get': 'list'}), name='all_instructors'),
]