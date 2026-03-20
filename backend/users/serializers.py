import re

from rest_framework import serializers
from .models import Citizen, Authority, AuthorityRequest, Category
from django.contrib.auth.hashers import make_password



class CitizenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Citizen
        fields = '__all__'
    
    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters")

        if not re.search(r"[A-Z]", value):
            raise serializers.ValidationError("Password must contain one uppercase letter")

        if not re.search(r"[a-z]", value):
            raise serializers.ValidationError("Password must contain one lowercase letter")

        if not re.search(r"[0-9]", value):
            raise serializers.ValidationError("Password must contain one number")

        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", value):
            raise serializers.ValidationError("Password must contain one special character")                    
        return value

    
    def validate_email(self, value):
        if Citizen.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

    def validate_username(self, value):
        if Citizen.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value
    
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)


class AuthoritySerializer(serializers.ModelSerializer):
    class Meta:
        model = Authority
        fields = '__all__'


class AuthorityRequestSerializer(serializers.ModelSerializer):

    class Meta:
        model = AuthorityRequest
        fields = "__all__"

    # Password validation (same as citizen)
    def validate_password(self, value):

        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters")

        if not re.search(r"[A-Z]", value):
            raise serializers.ValidationError("Password must contain one uppercase letter")

        if not re.search(r"[a-z]", value):
            raise serializers.ValidationError("Password must contain one lowercase letter")

        if not re.search(r"[0-9]", value):
            raise serializers.ValidationError("Password must contain one number")

        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", value):
            raise serializers.ValidationError("Password must contain one special character")

        return value


    # Email duplicate check
    def validate_email(self, value):

        if AuthorityRequest.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already used for another request")

        if Authority.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already belongs to an authority account")

        return value


    # Username duplicate check
    def validate_username(self, value):

        if AuthorityRequest.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already requested")

        if Authority.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already taken")

        return value


    # Employee ID duplicate check
    def validate_employee_id(self, value):

        if AuthorityRequest.objects.filter(employee_id=value).exists():
            raise serializers.ValidationError("Employee ID already submitted")

        if Authority.objects.filter(employee_id=value).exists():
            raise serializers.ValidationError("Employee ID already registered")

        return value


    # File validation
    def validate_document(self, file):

        if file.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("File must be smaller than 5MB")

        allowed_types = ["application/pdf", "image/jpeg", "image/png"]

        if file.content_type not in allowed_types:
            raise serializers.ValidationError("Only PDF, JPG, PNG files allowed")

        return file


    def create(self, validated_data):

        validated_data['password'] = make_password(validated_data['password'])

        return super().create(validated_data)



class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

