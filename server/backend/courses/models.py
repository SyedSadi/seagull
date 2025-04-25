from django.db import models
from users.models import User, Instructor, Student
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator


# Model representing an educational course
class Course(models.Model):
     # Choices for difficulty level
    DIFFICULTY_LEVELS = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]
    title = models.CharField(max_length=255)    # Course title
    description = models.TextField()     # Course overview
    created_by = models.ForeignKey(Instructor, on_delete=models.CASCADE, null=True )    # Linked instructor
    duration = models.PositiveIntegerField()     # Course length (hours/mins)
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_LEVELS)     # Difficulty level
    subject = models.CharField(max_length=255)       # Course subject/category
    ratings = models.FloatField(default=0.0)     # Average rating
    image = models.URLField(blank=True, null=True)        # Optional course image

    def __str__(self):
        return self.title

    # Update course's average rating from all user ratings
    def update_avg_rating(self):
        avg_rating = self.ratings_set.aggregate(models.Avg('rating'))['rating__avg']
        self.ratings = avg_rating if avg_rating else 0.0
        self.save(update_fields=['ratings'])
    
    # Return total number of ratings for the course
    @property
    def ratings_count(self):
        return self.ratings_set.count()

# Model representing course contents like videos, PDFs, and articles
class CourseContents(models.Model):

     # Content types supported
    CONTENT_TYPES = [
        ('video', 'Video'),
        ('pdf', 'PDF'),
        ('article', 'Article'),
    ]

    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='contents')    # Related course
    content_type = models.CharField(max_length=20, choices=CONTENT_TYPES)   # Type of content
    title = models.CharField(max_length=255)     # Title of content
    order = models.PositiveIntegerField(default=0)  # Display order in course
    url = models.URLField(null=True, blank=True)     # URL for video/pdf
    text_content = models.TextField(blank=True) # For article text

    class Meta:
        ordering = ['order']    # Contents sorted by display order

    def __str__(self):
        return f"{self.title}/{self.content_type}"

    # Custom validation to ensure correct fields are filled based on content type
    def clean(self):
        if self.content_type == 'video' and not self.url:
            raise ValidationError("Video content must have a URL.")
        if self.content_type == 'article' and not self.text_content:
            raise ValidationError("Article text contents cannot be empty.")
        if self.content_type == 'pdf' and not self.url:
            raise ValidationError("PDF content must include a url.")

    # Validate before saving
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
    

# Model tracking student enrollment in a course
class Enrollment(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)    # Enrolled course
    student = models.ForeignKey(Student, on_delete=models.CASCADE, null=True)   # Enrolled student
    enrolled_at = models.DateTimeField(auto_now_add=True)   # Timestamp of enrollment

    class Meta:
        unique_together = ('course', 'student')   # Ensure unique enrollment per student/course

    def __str__(self):
        return self.course.title

# Model representing a student's rating for a course  
class Rating(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='ratings_set')    # Rated course
    user = models.ForeignKey(User, on_delete=models.CASCADE)     # User who rated
    rating = models.PositiveSmallIntegerField(
    validators=[
        MinValueValidator(1),   # Minimum rating
        MaxValueValidator(5)    # Maximum rating
    ]
    )

    class Meta:
        unique_together = ('course', 'user')    # One rating per course per user

    # Override save method to validate and trigger rating updates
    def save(self, *args, **kwargs):
        # Ensure only enrolled students can rate
        if not Enrollment.objects.filter(course=self.course, student__user=self.user).exists():
            raise ValidationError("You must be enrolled in the course to rate it.")
        
        super().save(*args, **kwargs)
        self.course.update_avg_rating()   # Update course rating after saving   

    def __str__(self):
        return f"{self.user.username} - {self.course.title} - {self.rating}"