from django.contrib import admin
from mptt.admin import MPTTModelAdmin

# Register your models here.

from .models import Post, Comment, Vote,Tag
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'created_at')
    filter_horizontal = ('tags',)  # Enables a multi-select widget

admin.site.register(Post,PostAdmin)
admin.site.register(Comment)
class CommentAdmin(MPTTModelAdmin):
    mptt_level_indent = 20  # Indent replies for better visibility
    list_display = ("user", "post", "content", "created_at", "parent")
    search_fields = ("content", "user__username")
    list_filter = ("created_at",)
admin.site.register(Vote)
admin.site.register(Tag)