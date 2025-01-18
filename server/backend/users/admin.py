from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Instructor, Student

class UserAdmin(UserAdmin):
    model = User
    list_display = ['username', 'email', 'role', 'bio']  # added 'role' here
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('bio', 'role')}),  # Added 'role' here as well
    )

admin.site.register(User, UserAdmin)

admin.site.register(Instructor)
class InstructorAdmin(admin.ModelAdmin):
    list_display = ['user', 'designation', 'university']  # Add any fields you want to display

admin.site.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['user', 'course_completed', 'course_enrolled']