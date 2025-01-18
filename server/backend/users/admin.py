from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Instructor, Student

class UserAdmin(UserAdmin):
    model = User
    list_display = ['username', 'email', 'role', 'bio']  # Display fields in the list view
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('role', 'bio')}),  # Add role and bio fields here
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('role', 'bio')}),  # Add role and bio to the add user form
    )

admin.site.register(User, UserAdmin)

admin.site.register(Instructor)
class InstructorAdmin(admin.ModelAdmin):
    list_display = ['user', 'designation', 'university']  # Add any fields you want to display

admin.site.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['user', 'course_completed', 'course_enrolled']