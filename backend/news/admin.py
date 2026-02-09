from django.contrib import admin
from .models import News


@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ["title", "date", "created_at"]
    list_filter = ["date"]
    search_fields = ["title", "summary"]
