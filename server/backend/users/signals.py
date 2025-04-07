# users/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, Student, Instructor

@receiver(post_save, sender=User)
def create_student_or_instructor(sender, instance, created, **kwargs):
    if created:
        if instance.role == 'student':
            Student.objects.create(user=instance)
        elif instance.role == 'instructor':
            Instructor.objects.create(user=instance)
