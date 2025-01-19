from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Course

@receiver(post_save, sender=Course)
def initialize_ratings(sender, instance, created, **kwargs):
    if created and instance.ratings == 0:
        instance.ratings = 0.0
        instance.save()