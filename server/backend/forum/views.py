from django.shortcuts import render

# Create your views here.
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from .permissions import IsAuthorOrReadOnly
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Post, Comment, Vote
from .serializers import PostSerializer, CommentSerializer, VoteSerializer
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Vote, Post

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at').select_related('author').prefetch_related('comments__replies')
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
        
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('-created_at').select_related('user', 'post')
    serializer_class = CommentSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class VoteViewSet(viewsets.ModelViewSet):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user = request.user
        post_id = request.data.get("post")
        value = int(request.data.get("value"))

        if value not in [1, -1]:
            return Response({"error": "Invalid vote value."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({"error": "Post not found."}, status=status.HTTP_404_NOT_FOUND)

        # Check if the user has already voted on this post
        existing_vote = Vote.objects.filter(user=user, post=post).first()

        if existing_vote:
            if existing_vote.value == value:
                # If the user clicks the same vote again, remove the vote
                existing_vote.delete()
                return Response({"message": "Vote removed."}, status=status.HTTP_200_OK)
            else:
                # If the user clicks the opposite vote, update the vote
                existing_vote.value = value
                existing_vote.save()
                return Response({"message": "Vote updated."}, status=status.HTTP_200_OK)
        else:
            # Ensure votes are user-specific
            new_vote = Vote.objects.create(user=user, post=post, value=value)
            return Response({"message": "Vote recorded.", "vote_id": new_vote.id}, status=status.HTTP_201_CREATED)
