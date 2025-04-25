# users/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, Student, Instructor

@receiver(post_save, sender=User)
def create_student_or_instructor(sender, instance, created, **kwargs):
    """
    Signal receiver that listens to the post_save signal of the User model.
    
    This function is triggered automatically after a User instance is saved.
    If the user was just created, it checks the user's role and creates
    a corresponding Student or Instructor profile.
    """
    if created:
        # Automatically create a Student profile if the role is 'student'
        if instance.role == 'student':
            Student.objects.create(user=instance)
        
        elif instance.role == 'instructor':
            Instructor.objects.create(user=instance)
