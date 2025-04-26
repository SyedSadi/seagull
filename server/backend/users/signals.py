# users/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, Student, Instructor

@receiver(post_save, sender=User)
def create_student_or_instructor(sender, instance, created, **kwargs):
    """
    Signal receiver that listens to the post_save signal of the User model.
    Automatically creates a Student or Instructor profile based on the user's role after creation.
    """
    if not created:
        return

    role_model_map = {
        'student': Student,
        'instructor': Instructor,
    }
    
    model = role_model_map.get(instance.role)
    if model:
        model.objects.create(user=instance)
