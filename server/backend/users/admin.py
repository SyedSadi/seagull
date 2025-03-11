from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Instructor, Student

class UserAdmin(UserAdmin):
    model = User
    list_display = ['username', 'email', 'role', 'bio']
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('role', 'bio')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('role', 'bio')}),
    )

admin.site.register(User, UserAdmin)

admin.site.register(Instructor)
class InstructorAdmin(admin.ModelAdmin):
    list_display = ['user', 'designation', 'university']

admin.site.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['user', 'course_completed', 'course_enrolled']