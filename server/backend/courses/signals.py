from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Course

# Signal receiver function to run after a Course instance is saved
@receiver(post_save, sender=Course)
def initialize_ratings(sender, instance, created, **kwargs):
    """
    Signal handler to initialize the ratings field of a Course object after creation.

    This ensures that even if the default value is bypassed somehow,
    newly created Course instances have a float value (0.0) for 'ratings'.
    """
     # Check if the Course instance was just created and the ratings field is 0 (int)
    if created and instance.ratings == 0:
         # Update ratings to 0.0 (float) for consistency
        instance.ratings = 0.0
        instance.save()