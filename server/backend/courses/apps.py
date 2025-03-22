from django.apps import AppConfig


class CoursesConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "courses"
    label= "courses"

    def ready(self):
        import courses.signals