from django.test import TestCase
from .models import Course, CourseContents

class CourseModelTest(TestCase):
    def setUp(self):
        self.course = Course.objects.create(
            title="Sample Course",
            description="A test course.",
            ratings=4.8,
            duration=10,
            difficulty="beginner",
            topic="Testing",
            subject="Django"
        )

    def test_course_creation(self):
        self.assertEqual(self.course.title, "Sample Course")

    def test_course_contents(self):
        content = CourseContents.objects.create(
            course=self.course,
            content_type="text",
            title="Sample Content",
            text_content="This is a test content."
        )
        self.assertEqual(content.course.title, "Sample Course")
