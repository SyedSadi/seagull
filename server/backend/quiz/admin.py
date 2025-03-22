from django.contrib import admin
from .models import Category, Question, Option, QuizAttempt, UserAnswer

class OptionInline(admin.TabularInline):
    model = Option
    extra = 4

class QuestionAdmin(admin.ModelAdmin):
    inlines = [OptionInline]
    list_display = ('text', 'category')
    list_filter = ('category',)
    search_fields = ('text',)

class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'question_count', 'created_at')
    search_fields = ('name',)

class UserAnswerInline(admin.TabularInline):
    model = UserAnswer
    readonly_fields = ('question', 'selected_option', 'is_correct')
    can_delete = False
    extra = 0

class QuizAttemptAdmin(admin.ModelAdmin):
    list_display = ('user', 'category', 'score', 'started_at', 'completed_at')
    list_filter = ('category', 'user')
    search_fields = ('user__username',)
    inlines = [UserAnswerInline]

admin.site.register(Category, CategoryAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(QuizAttempt, QuizAttemptAdmin)