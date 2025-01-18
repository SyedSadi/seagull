from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Course, CourseContents

admin.site.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_by', 'ratings', 'duration', 'difficulty')
    search_fields = ('title', 'subject', 'topic')
    list_filter = ('difficulty',)

admin.site.register(CourseContents)
class CourseContentsAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'content_type')
    search_fields = ('title', 'course__title')
    list_filter = ('content_type',)
