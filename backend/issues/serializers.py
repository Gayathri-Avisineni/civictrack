from rest_framework import serializers
from .models import Issue, Comment
from django.contrib.auth import get_user_model
from users.serializers import UserSerializer

User = get_user_model()


class IssueSerializer(serializers.ModelSerializer):

    assigned_authority = UserSerializer(
    read_only=True
)

    support_count = serializers.SerializerMethodField()
    is_supported = serializers.SerializerMethodField()

    class Meta:
        model = Issue
        fields = "__all__"
        read_only_fields = ("reporter_email", "reporter_name")

    def get_support_count(self, obj):
        return obj.supporters.count()

    def get_is_supported(self, obj):
        request = self.context.get("request")

        if request and request.user.is_authenticated:
            return obj.supporters.filter(id=request.user.id).exists()

        return False

    def update(self, instance, validated_data):
        validated_data.pop("photo", None)
        return super().update(instance, validated_data)

    def create(self, validated_data):

        # remove unnecessary fields
        validated_data.pop("supporters", None)

        # photo separate ga handle chestham
        photo = self.context["request"].FILES.get("photo")

        request = self.context.get("request")
        user = request.user

        if not user.is_authenticated:
            raise serializers.ValidationError(
                "User is not authenticated"
            )

        # reporter details
        validated_data["reporter_email"] = user.email
        validated_data["reporter_name"] = user.username

        # authority auto assign
        category = validated_data.get("category")
        area = validated_data.get("area")

        authority = User.objects.filter(
            role="authority",
            category=category,
            area__iexact=area
        ).first()

        validated_data["assigned_authority"] = authority

        # create issue
        issue = Issue.objects.create(**validated_data)

        # save photo
        if photo:
            issue.photo = photo
            issue.save()

        return issue


class CommentSerializer(serializers.ModelSerializer):

    user_name = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            "id",
            "text",
            "created_at",
            "user_name"
        ]

    def get_user_name(self, obj):
        return obj.user.username