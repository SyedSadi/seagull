from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('instructor', 'Instructor'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    bio = models.TextField(null=True, blank=True)
    # profile_picture = models.ImageField(upload_to='profiles/', null=True, blank=True)

    def __str__(self):
        return self.username

class Instructor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    designation = models.CharField(max_length=100)
    university = models.CharField(max_length=100)
    # Add other instructor-specific fields

    def __str__(self):
        return self.user.username

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    course_completed = models.IntegerField(default=0)
    course_enrolled = models.IntegerField(default=0)
    # Add other student-specific fields

    def __str__(self):
        return self.user.username
