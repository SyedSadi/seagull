from django.db import models
from django.conf import settings

# ---------------------- CATEGORY MODEL ----------------------
class Category(models.Model):
    """Model representing a quiz category (e.g., Math, Science)."""
    name = models.CharField(max_length=100)     # Name of the category
    description = models.TextField()         # Description of the category
    created_at = models.DateTimeField(auto_now_add=True)    # Timestamp when created

    def __str__(self):
        return self.name

    @property
    def question_count(self):
        """Returns the total number of questions in this category."""
        return self.question_set.count()

# ---------------------- QUESTION MODEL ----------------------
class Question(models.Model):
    """Model representing a question in a quiz."""
    category = models.ForeignKey(Category, on_delete=models.CASCADE)    # Associated category
    text = models.TextField()   # Question text
    created_at = models.DateTimeField(auto_now_add=True)    # Timestamp when created

    def __str__(self):
        return self.text[:50]

# ---------------------- OPTION MODEL ----------------------
class Option(models.Model):
    """Model representing multiple choice options for a question."""
    question = models.ForeignKey(Question, related_name='options', on_delete=models.CASCADE)    # Related question
    text = models.CharField(max_length=255)   # Option text
    is_correct = models.BooleanField(default=False)      # Whether this option is correct

    def __str__(self):
        return self.text

# ---------------------- QUIZ ATTEMPT MODEL ----------------------
class QuizAttempt(models.Model):
    """Model tracking a user's attempt at a quiz."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)    # User taking the quiz
    category = models.ForeignKey(Category, on_delete=models.CASCADE)    # Category of the quiz
    score = models.IntegerField()   # Score achieved by the user
    completed = models.BooleanField(default=False)  # Whether the quiz was completed
    started_at = models.DateTimeField(auto_now_add=True)    # Time when quiz started
    completed_at = models.DateTimeField(null=True, blank=True)  # Time when quiz was completed

    def __str__(self):
        return f"{self.user.username} - {self.category.name} - {self.score}/{self.category.question_count}"

# ---------------------- USER ANSWER MODEL ----------------------
class UserAnswer(models.Model):
    """Model representing a user's answer to a quiz question."""
    attempt = models.ForeignKey(QuizAttempt, related_name='answers', on_delete=models.CASCADE)   # Quiz attempt
    question = models.ForeignKey(Question, on_delete=models.CASCADE)    # Question answered
    selected_option = models.ForeignKey(Option, null=True, blank=True, on_delete=models.SET_NULL)   # Option selected
    is_correct = models.BooleanField(default=False) # Whether the selected option is correct

    def __str__(self):
        return f"{self.question.text[:30]} - {'Correct' if self.is_correct else 'Incorrect'}"