from django.db import models
from django.db.models import Avg
from users.models import User, Instructor, Student

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
    duration = models.PositiveIntegerField()  # Hours
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_LEVELS)
    # topic = models.CharField(max_length=255)
    subject = models.CharField(max_length=255)
    ratings = models.FloatField(default=0.0)

    def __str__(self):
        return self.title
    
    def update_avg_rating(self):
        avg_rating = self.ratings_set.aggregate(models.Avg('rating'))['rating__avg']
        self.ratings = avg_rating if avg_rating else 0.0
        self.save()

class CourseContents(models.Model):
    CONTENT_TYPES = [
        ('video', 'Video'),
        ('pdf', 'PDF'),
        ('text', 'Text'),
        ('article', 'Article'),
    ]
    course = models.ManyToManyField(Course, related_name='contents')
    content_type = models.CharField(max_length=20, choices=CONTENT_TYPES)
    title = models.CharField(max_length=255)
    video_url = models.URLField(null=True, blank=True)
    file_link = models.URLField(null=True, blank=True)
    text_content = models.TextField(blank=True)


    def __str__(self):
        return f"{self.title}/{self.content_type}"
    


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
    rating = models.PositiveSmallIntegerField()

    class Meta:
        unique_together = ('course', 'user')  # Ensures a user can only rate a course once

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.course.update_avg_rating() 

    def __str__(self):
        return f"{self.user.username} - {self.course.title} - {self.rating}"