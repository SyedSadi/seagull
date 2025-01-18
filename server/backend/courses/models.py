from django.db import models

# Create your models here.
class Course(models.Model):
    DIFFICULTY_LEVELS = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]
    title = models.CharField(max_length=255)
    description = models.TextField()
    # created_by = models.ForeignKey(Instructor, on_delete=models.CASCADE)
    ratings = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    duration = models.PositiveIntegerField()  # Hours
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_LEVELS)
    # topic = models.CharField(max_length=255)
    subject = models.CharField(max_length=255)

    def __str__(self):
        return self.title

class CourseContents(models.Model):
    CONTENT_TYPES = [
        ('video', 'Video'),
        ('pdf', 'PDF'),
        ('text', 'Text'),
        ('article', 'Article'),
    ]
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='contents')
    content_type = models.CharField(max_length=20, choices=CONTENT_TYPES)
    title = models.CharField(max_length=255)
    video_url = models.URLField(null=True, blank=True)
    file_link = models.URLField(null=True, blank=True)
    text_content = models.TextField(null=True, blank=True)


    def __str__(self):
        return f"{self.title}/{self.content_type}"
    


class Enrollment(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    # student = models.ForeignKey(Student, on_delete=models.CASCADE)
    enrolled_at = models.DateTimeField(auto_now_add=True)


class Rating(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    # user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField()
    feedback = models.TextField(null=True, blank=True)
