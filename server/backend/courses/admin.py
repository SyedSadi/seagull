from django.contrib import admin
from .models import Course, CourseContents, Rating, Enrollment

class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_by', 'ratings', 'duration', 'difficulty')
    search_fields = ('title', 'subject', 'topic')
    list_filter = ('difficulty',)
admin.site.register(Course)

class CourseContentsAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'content_type')
    search_fields = ('title', 'course__title')
    list_filter = ('content_type',)
admin.site.register(CourseContents)

class RatingAdmin(admin.ModelAdmin):
    list_display = ('course', 'user', 'rating')
    list_filter = ('rating',)
    search_fields = ['course__title', 'user__username']

admin.site.register(Rating, RatingAdmin)

class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('course', 'student', 'enrolled_at')
    list_filter = ('enrolled_at',)

admin.site.register(Enrollment, EnrollmentAdmin)