from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """
    Custom User model that extends Django's built-in AbstractUser.
    Adds a 'role' field to differentiate between students and instructors,
    and a 'bio' field for additional user information.
    """
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('instructor', 'Instructor'),
    )
    # Role of the user: either 'student' or 'instructor'
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    # Optional biography or profile description
    bio = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.username

class Instructor(models.Model):
    """
    Instructor profile model. Extends the User model via a one-to-one relationship.
    Stores additional information specific to instructors.
    """
   
    user = models.OneToOneField(User, on_delete=models.CASCADE) # Link to the User model
    designation = models.CharField(max_length=100)   # Instructor's designation/title (e.g., Assistant Professor)
    university = models.CharField(max_length=100)   # University or institution the instructor is affiliated with

    def __str__(self):
        return self.user.username

class Student(models.Model):
    """
    Student profile model. Extends the User model via a one-to-one relationship.
    Stores additional information specific to students.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)  # Link to the custom User model
    course_completed = models.IntegerField(default=0)   # Number of courses completed by the student
    course_enrolled = models.IntegerField(default=0)    # Number of courses the student is currently enrolled in

    def __str__(self): 
        return self.user.username
