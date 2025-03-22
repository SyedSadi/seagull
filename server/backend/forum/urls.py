from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, CommentViewSet, VoteViewSet, TagViewSet

# Use a router to auto-generate URL patterns for viewsets
router = DefaultRouter()
router.register(r'posts', PostViewSet)
router.register(r'comments', CommentViewSet , basename='comment')
router.register(r'votes', VoteViewSet)
router.register(r'tags', TagViewSet)

urlpatterns = [
    path('', include(router.urls)),  # Automatically include all viewset routes
    path('votes/<int:post_id>/user-vote/', VoteViewSet.as_view({'get': 'get_user_vote'})),  # Keep custom endpoint
]
