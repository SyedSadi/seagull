from django.utils.timezone import now
from datetime import timedelta
from users.models import User
from courses.models import Course, CourseContents
from quiz.models import Category

class DashboardStatsService:
    @staticmethod
    def get_dashboard_stats():
        new_users_last_7_days = User.objects.filter(date_joined__gte=now() - timedelta(days=7))
        active_users_last_24_hours = User.objects.filter(last_login__gte=now() - timedelta(days=1))

        stats = {
            "total_users": User.objects.count(),
            "total_students": User.objects.filter(role='student').count(),
            "total_instructors": User.objects.filter(role='instructor').count(),
            "total_courses": Course.objects.count(),
            "total_contents": CourseContents.objects.count(),
            "total_quizzes": Category.objects.count(),
            "new_users_last_7_days": new_users_last_7_days,
            "active_users_last_24_hours": active_users_last_24_hours,
        }

        return stats
    
class LandingPageStatsService:
    @staticmethod
    def get_landingpage_stats():
        stats={
            "total_students":User.objects.filter(role='student').count(),
            "total_instructors":User.objects.filter(role='instructor').count(),
            "total_courses":Course.objects.count(),
            "total_quizzes":Category.objects.count(),
        }
        return stats
