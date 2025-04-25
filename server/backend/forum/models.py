from django.db import models
from django.conf import settings
from mptt.models import MPTTModel, TreeForeignKey

# Model representing a Tag for categorizing posts.
class Tag(models.Model):
    name=models.CharField( max_length=50,unique=True)   # Unique tag name (e.g., 'Python', 'Django')
    def __str__(self):
        return self.name
    

# Model representing a Forum Post.
class Post(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # User who created the post
    tags = models.ManyToManyField(Tag, related_name="posts")    # Tags associated with this post
    title = models.CharField(max_length=200)    # Title of the post
    content = models.TextField()    # Body/content of the post
    created_at = models.DateTimeField(auto_now_add=True)    # Timestamp when post was created
    updated_at = models.DateTimeField(auto_now=True)

    def total_votes(self):
        # Returns the total vote score (upvotes - downvotes)
        return self.votes.filter(value=1).count() - self.votes.filter(value=-1).count()

    def __str__(self):
        return self.title

# Model representing a Comment, using MPTT for nested (threaded) comments.
class Comment(MPTTModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)    # User who made the comment
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")   # Related post
    parent = TreeForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name="children")
    # Allows nested comments by referencing parent comment
    content = models.TextField()    # The comment text
    created_at = models.DateTimeField(auto_now_add=True)    # Timestamp when comment was made
    updated_at = models.DateTimeField(auto_now=True)    # Timestamp when comment was last edited
    
    class MPTTMeta:
        order_insertion_by = ['created_at']   # Order comments by creation time

    def __str__(self):
        return f"Comment by {self.user} on {self.post}"

# Model representing a Vote on a Post.        
class Vote(models.Model):
    VOTE_CHOICES = ((1, 'Upvote'), (-1, 'Downvote'))    # Allowed vote values
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)    # User who voted
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="votes")  # Post being voted on
    value = models.SmallIntegerField(choices=VOTE_CHOICES)  # Vote value (1 for upvote, -1 for downvote)

    class Meta:
        unique_together = ('user', 'post')  # Ensure a user can only vote once per post
