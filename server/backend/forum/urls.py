from django.urls import path
from .views import PostViewSet, CommentViewSet, VoteViewSet

urlpatterns = [
    path('posts/', PostViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('posts/<int:pk>/', PostViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})),

    path('comments/', CommentViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('comments/<int:pk>/', CommentViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})),

    path('votes/', VoteViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('votes/<int:pk>/', VoteViewSet.as_view({'get': 'retrieve', 'delete': 'destroy'})),
]
