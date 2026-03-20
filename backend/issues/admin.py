from django.contrib import admin

# Register your models here.
from .models import Issue,Comment

class IssueAdmin(admin.ModelAdmin):

    list_display = (
        "title",
        "category",
        "area",
        "pincode",
        "reporter_email",
        "created_at"
    )

    list_filter = (
        "category",
        "area",
        "pincode"
    )

    search_fields = (
        "title",
        "description",
        "address"
    )

admin.site.register(Issue, IssueAdmin)

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "issue_info",
        "user",
        "short_text",
        "created_at"
    )

    list_filter = ("created_at", "issue")
    search_fields = ("text", "user__username", "issue__title")
    ordering = ("-created_at",)

    def issue_info(self, obj):
        return f"{obj.issue.title} ({obj.issue.area})"

    issue_info.short_description = "Issue"

    def short_text(self, obj):
        return obj.text[:40] + "..." if len(obj.text) > 40 else obj.text

    short_text.short_description = "Comment"


