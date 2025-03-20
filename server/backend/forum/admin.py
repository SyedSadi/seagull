from django.contrib import admin

# Register your models here.

from .models import Post, Comment, Vote,Tag
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'created_at')
    filter_horizontal = ('tags',)  # Enables a multi-select widget

admin.site.register(Post,PostAdmin)
admin.site.register(Comment)
admin.site.register(Vote)
admin.site.register(Tag)