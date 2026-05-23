from django.contrib import admin
from django.utils.html import format_html
from django.contrib.auth.admin import UserAdmin

from .models import User, Category, AuthorityRequest


# -------- USER ADMIN --------
@admin.register(User)
class CustomUserAdmin(UserAdmin):

    list_display = (
        "username",
        "email",
        "role",
        "category",
        "is_online",
        "last_login",
        "last_logout",
        "is_staff",
    )

    list_filter = (
        "role",
        "is_online",
        "category",
        "is_staff",
    )

    search_fields = (
        "username",
        "email",
        "first_name",
        "last_name",
    )

    ordering = ("-id",)

    fieldsets = (
        ("Login Info", {
            "fields": (
                "username",
                "password",
                "email"
            )
        }),

        ("Personal Info", {
            "fields": (
                "full_name",
                "first_name",
                "last_name",
                "phone",
            )
        }),

        ("Authority Info", {
            "fields": (
                "category",
                "area",
                "employee_id",
                "office_address",
                "document",
            )
        }),

        ("Status", {
            "fields": (
                "role",
                "is_online",
                "last_login",
                "last_logout",
                "is_active",
                "is_staff",
                "is_superuser",
            )
        }),

        ("Permissions", {
            "fields": (
                "groups",
                "user_permissions",
            )
        }),
    )


# -------- CATEGORY ADMIN --------
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):

    list_display = ("name",)


# -------- AUTHORITY REQUEST ADMIN --------
@admin.register(AuthorityRequest)
class AuthorityRequestAdmin(admin.ModelAdmin):

    list_display = (
        "username",
        "category",
        "employee_id",
        "colored_status",
        "created_at"
    )

    list_filter = (
        "status",
        "category"
    )

    search_fields = (
        "username",
        "email",
        "employee_id"
    )

    ordering = (
        "status",
        "-created_at"
    )

    def colored_status(self, obj):

        if obj.status == "pending":
            color = "orange"

        elif obj.status == "approved":
            color = "green"

        else:
            color = "red"

        return format_html(
            '<strong style="color:{};">{}</strong>',
            color,
            obj.status.capitalize()
        )

    colored_status.short_description = "Status"