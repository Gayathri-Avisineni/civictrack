
from rest_framework import serializers
from .models import Issue,Comment
from users.models import Authority
from users.models import Category
from users.serializers import AuthoritySerializer

class IssueSerializer(serializers.ModelSerializer):

    assigned_authority = AuthoritySerializer(read_only=True)
    support_count = serializers.SerializerMethodField()
    is_supported = serializers.SerializerMethodField()
    
    class Meta:
        model = Issue
        fields = "__all__"
    
    def get_support_count(self, obj):
        return obj.supporters.count()

    def get_is_supported(self, obj):
        user = self.context.get("request").user
        if user.is_authenticated:
            return obj.supporters.filter(id=user.id).exists()
        return False

    def create(self, validated_data):

        category = validated_data.get("category")
        area = validated_data.get("area")

        
        authority = Authority.objects.filter(
            category=category,
            area__iexact=area
        ).first()

        validated_data["assigned_authority"] = authority

        issue = Issue.objects.create(**validated_data)

        return issue
    
    

    
        
    



class CommentSerializer(serializers.ModelSerializer):

    user_name = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ["id", "text", "created_at", "user_name"]

    def get_user_name(self, obj):
        return obj.user.username