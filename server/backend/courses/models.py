from django.db import models
from users.models import User, Instructor, Student
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator


# Create your models here.
class Course(models.Model):
    DIFFICULTY_LEVELS = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]
    title = models.CharField(max_length=255)
    description = models.TextField()
    created_by = models.ForeignKey(Instructor, on_delete=models.CASCADE, null=True)
    duration = models.PositiveIntegerField()
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_LEVELS)
    subject = models.CharField(max_length=255)
    ratings = models.FloatField(default=0.0)
    image = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.title
    
    def update_avg_rating(self):
        avg_rating = self.ratings_set.aggregate(models.Avg('rating'))['rating__avg']
        self.ratings = avg_rating if avg_rating else 0.0
        self.save(update_fields=['ratings'])
    
    @property
    def ratings_count(self):
        return self.ratings_set.count()

class CourseContents(models.Model):
    CONTENT_TYPES = [
        ('video', 'Video'),
        ('pdf', 'PDF'),
        ('article', 'Article'),
    ]

    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='contents')
    content_type = models.CharField(max_length=20, choices=CONTENT_TYPES)
    title = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0)
    url = models.URLField(null=True, blank=True)
    text_content = models.TextField(blank=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.title}/{self.content_type}"

    def clean(self):
        if self.content_type == 'video' and not self.url:
            raise ValidationError("Video content must have a URL.")
        if self.content_type == 'article' and not self.text_content:
            raise ValidationError("Article text contents cannot be empty.")
        if self.content_type == 'pdf' and not self.url:
            raise ValidationError("PDF content must include a url.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
    


class Enrollment(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, null=True)
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('course', 'student') 

    def __str__(self):
        return self.course.title
    
class Rating(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='ratings_set')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField(
    validators=[
        MinValueValidator(1),
        MaxValueValidator(5)
    ]
    )

    class Meta:
        unique_together = ('course', 'user')

    def save(self, *args, **kwargs):
        # Ensure only enrolled students can rate
        if not Enrollment.objects.filter(course=self.course, student__user=self.user).exists():
            raise ValidationError("You must be enrolled in the course to rate it.")
        
        super().save(*args, **kwargs)
        self.course.update_avg_rating()

    def __str__(self):
        return f"{self.user.username} - {self.course.title} - {self.rating}"