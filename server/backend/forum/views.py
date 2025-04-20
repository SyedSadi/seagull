from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.decorators import action

from .models import Post, Comment, Vote,Tag
from .serializers import PostSerializer, CommentSerializer, VoteSerializer,TagSerializer
from .permissions import IsAuthorOrReadOnly
from django.db.models import Count, Sum, Case, When, IntegerField, F,Q
from ai_utils.hf_detector import detect_toxic_content

from rest_framework.exceptions import ValidationError


def block_if_toxic(content):
    print("Checking content for toxicity:", content)
    if not content:
        return

    toxic_response = detect_toxic_content(content)
    print("Model response:", toxic_response)  # DEBUG

    label, score = extract_top_label_and_score(toxic_response)

    if label == 'NEGATIVE' and score > 0.9:
        raise ValidationError("Your content violates our community guidelines.")


def extract_top_label_and_score(response):
    """
    Extracts the top label and score from the response.
    Handles potential nesting and unexpected formats.
    """
    if not isinstance(response, list) or not response:
        print("Unexpected response format:", response)
        return None, 0

    # Handle nested list structure
    first = response[0]
    if isinstance(first, list) and first:
        response = first
        first = response[0]

    if isinstance(first, dict):
        top = max(response, key=lambda x: x.get('score', 0))
        label = top.get('label')
        score = top.get('score', 0)
        print(f"Top label: {label}, Score: {score}")  # DEBUG
        return label, score

    print("Unexpected inner structure:", first)
    return None, 0



class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at').prefetch_related('tags')
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
            queryset = queryset.filter(tags__name__iexact=tag_name)

        return queryset

    def perform_create(self, serializer):
        content = serializer.validated_data.get('content')
        block_if_toxic(content)  # ✅ Will raise exception if toxic
        serializer.save(author=self.request.user)

    def update(self, request, *args, **kwargs):
        content = request.data.get('content')
        block_if_toxic(content)  # Now raises ValidationError if toxic
        return super().update(request, *args, **kwargs)
        
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.author != request.user:
            return Response({"error": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    
   

class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]

    def get_queryset(self):
        queryset = Comment.objects.select_related('user', 'post').prefetch_related('children')

        if self.action == 'list':
            queryset = queryset.filter(parent=None)  # ✅ Fetch only top-level comments

        return queryset

    def perform_create(self, serializer):
        content = serializer.validated_data.get('content')
        block_if_toxic(content)  # ✅ Will raise exception if toxic
        serializer.save(user=self.request.user)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user != request.user:
            return Response({"error": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

        content = request.data.get('content')
        block_if_toxic(content)  # Will raise ValidationError if toxic

        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user != request.user:
            return Response({"error": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)




class VoteViewSet(viewsets.ModelViewSet):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

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

        existing_vote = Vote.objects.filter(user=user, post=post).first()

        if existing_vote:
            if existing_vote.value == value:
                # Remove vote if clicking the same vote again
                existing_vote.delete()
                total_votes = post.votes.filter(value=1).count() - post.votes.filter(value=-1).count()
                return Response({"message": "Vote removed.", "total_votes": total_votes, "user_vote": 0}, status=status.HTTP_200_OK)
            else:
                # Update vote
                existing_vote.value = value
                existing_vote.save()
        else:
            # Create new vote
            Vote.objects.create(user=user, post=post, value=value)

        total_votes = post.votes.filter(value=1).count() - post.votes.filter(value=-1).count()
        return Response({"message": "Vote updated.", "total_votes": total_votes, "user_vote": value}, status=status.HTTP_200_OK)



    @action(detail=False, methods=['get'], url_path=r'(?P<post_id>\d+)/user-vote', permission_classes=[IsAuthenticated])
    def get_user_vote(self, request, post_id=None):
        """Allow only authenticated users to see their own vote on a post."""
        vote = Vote.objects.filter(user=request.user, post_id=post_id).first()
        return Response({"user_vote": vote.value if vote else 0}, status=status.HTTP_200_OK)

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

    def create(self, request, *args, **kwargs):
        name = request.data.get('name', '').strip()

        if not name:
            return Response({'error': 'Tag name cannot be empty.'}, status=status.HTTP_400_BAD_REQUEST)

        # Prevent duplicates (case-insensitive)
        tag = Tag.objects.filter(name__iexact=name).first()
        if tag:
            serializer = self.get_serializer(tag)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # Otherwise create a new tag
        serializer = self.get_serializer(data={'name': name})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '').strip()
        if not query:
            return Response([], status=status.HTTP_200_OK)
        
        tags = Tag.objects.filter(name__icontains=query)[:10]  # return top 10 matches
        serializer = self.get_serializer(tags, many=True)
        return Response(serializer.data)