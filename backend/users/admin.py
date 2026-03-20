from django.contrib import admin
from .models import Category, Citizen, Authority, AuthorityRequest
from django.utils.html import format_html
# Register your models here.

# -------- Citizen Admin --------
@admin.register(Citizen)
class CitizenAdmin(admin.ModelAdmin):

    list_display = ("username","email","is_online","last_login","last_logout")


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):

    list_display = ("name",)


# -------- Authority Admin --------
@admin.register(Authority)
class AuthorityAdmin(admin.ModelAdmin):

    list_display = ("username","category","is_online","last_login","last_logout")


@admin.register(AuthorityRequest)
class AuthorityRequestAdmin(admin.ModelAdmin):

    list_display = (
        "username",
        "category",
        "employee_id",
        "colored_status",
        "created_at"
    )

    list_filter = ("status", "category")

    search_fields = ("username", "email", "employee_id")

    ordering = ("status", "-created_at")


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

