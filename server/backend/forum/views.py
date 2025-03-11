from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from .models import Post, Comment, Vote,Tag
from .serializers import PostSerializer, CommentSerializer, VoteSerializer,TagSerializer
from .permissions import IsAuthorOrReadOnly
from django.db.models import Count, Sum, Case, When, IntegerField, F,Q


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at').prefetch_related('comments__replies', 'tags')
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset().annotate(
            upvotes=Count('votes', filter=Q(votes__value=1)),  # Count only upvotes
            downvotes=Count('votes', filter=Q(votes__value=-1)),  # Count only downvotes
            vote_count=F('upvotes') - F('downvotes')  # Compute total vote score
        )
        filter_type = self.request.query_params.get('filter', 'recent')
        tag_name = self.request.query_params.get('tag')

        if filter_type == 'highest_voted':
             queryset = queryset.order_by('-vote_count')
        elif filter_type == 'user_posts' and self.request.user.is_authenticated:
            queryset = queryset.filter(author=self.request.user)

        if tag_name:
            queryset = queryset.filter(tags__name=tag_name)

        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.filter(parent__isnull=True).order_by('-created_at')  # Fetch only top-level comments
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



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

        # Check if the user has already voted
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
            # Create a new vote
            new_vote = Vote.objects.create(user=user, post=post, value=value)
            return Response({"message": "Vote recorded.", "vote_id": new_vote.id}, status=status.HTTP_201_CREATED)

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer