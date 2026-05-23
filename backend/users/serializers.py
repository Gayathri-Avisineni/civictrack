import re

from rest_framework import serializers
from django.contrib.auth.hashers import make_password

from .models import (
    User,
    AuthorityRequest,
    Category
)


# ---------------- USER SERIALIZER ----------------
class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = "__all__"

    # Password validation
    def validate_password(self, value):

        if len(value) < 8:
            raise serializers.ValidationError(
                "Password must be at least 8 characters"
            )

        if not re.search(r"[A-Z]", value):
            raise serializers.ValidationError(
                "Password must contain one uppercase letter"
            )

        if not re.search(r"[a-z]", value):
            raise serializers.ValidationError(
                "Password must contain one lowercase letter"
            )

        if not re.search(r"[0-9]", value):
            raise serializers.ValidationError(
                "Password must contain one number"
            )

        if not re.search(
            r"[!@#$%^&*(),.?\":{}|<>]",
            value
        ):
            raise serializers.ValidationError(
                "Password must contain one special character"
            )

        return value

    # Email duplicate check
    def validate_email(self, value):

        if User.objects.filter(
            email=value
        ).exists():

            raise serializers.ValidationError(
                "Email already exists"
            )

        return value

    # Username duplicate check
    def validate_username(self, value):

        if User.objects.filter(
            username=value
        ).exists():

            raise serializers.ValidationError(
                "Username already exists"
            )

        return value

    # Hash password
    def create(self, validated_data):

        validated_data["password"] = (
            make_password(
                validated_data["password"]
            )
        )

        return super().create(
            validated_data
        )


# ---------------- AUTHORITY REQUEST ----------------
class AuthorityRequestSerializer(
    serializers.ModelSerializer
):

    class Meta:
        model = AuthorityRequest
        fields = "__all__"

    # Password validation
    def validate_password(self, value):

        if len(value) < 8:
            raise serializers.ValidationError(
                "Password must be at least 8 characters"
            )

        if not re.search(r"[A-Z]", value):
            raise serializers.ValidationError(
                "Password must contain one uppercase letter"
            )

        if not re.search(r"[a-z]", value):
            raise serializers.ValidationError(
                "Password must contain one lowercase letter"
            )

        if not re.search(r"[0-9]", value):
            raise serializers.ValidationError(
                "Password must contain one number"
            )

        if not re.search(
            r"[!@#$%^&*(),.?\":{}|<>]",
            value
        ):
            raise serializers.ValidationError(
                "Password must contain one special character"
            )

        return value

    # Email validation
    def validate_email(self, value):

        if AuthorityRequest.objects.filter(
            email=value
        ).exists():

            raise serializers.ValidationError(
                "Email already used for another request"
            )

        if User.objects.filter(
            email=value
        ).exists():

            raise serializers.ValidationError(
                "Email already belongs to an account"
            )

        return value

    # Username validation
    def validate_username(self, value):

        if AuthorityRequest.objects.filter(
            username=value
        ).exists():

            raise serializers.ValidationError(
                "Username already requested"
            )

        if User.objects.filter(
            username=value
        ).exists():

            raise serializers.ValidationError(
                "Username already taken"
            )

        return value

    # Employee ID validation
    def validate_employee_id(
        self,
        value
    ):

        if AuthorityRequest.objects.filter(
            employee_id=value
        ).exists():

            raise serializers.ValidationError(
                "Employee ID already submitted"
            )

        if User.objects.filter(
            employee_id=value
        ).exists():

            raise serializers.ValidationError(
                "Employee ID already registered"
            )

        return value

    # File validation
    def validate_document(
        self,
        file
    ):

        if file.size > (
            5 * 1024 * 1024
        ):
            raise serializers.ValidationError(
                "File must be smaller than 5MB"
            )

        allowed_types = [
            "application/pdf",
            "image/jpeg",
            "image/png"
        ]

        if (
            file.content_type
            not in allowed_types
        ):
            raise serializers.ValidationError(
                "Only PDF, JPG, PNG files allowed"
            )

        return file

    # Hash password
    def create(
        self,
        validated_data
    ):

        validated_data["password"] = (
            make_password(
                validated_data["password"]
            )
        )

        return super().create(
            validated_data
        )


# ---------------- CATEGORY ----------------
class CategorySerializer(
    serializers.ModelSerializer
):

    class Meta:
        model = Category
        fields = [
            "id",
            "name"
        ]