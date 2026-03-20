from urllib import request

from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import IssueSerializer,CommentSerializer
from .models import Comment, Issue
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes    
# Create your views here.
@api_view(["POST"])
def create_issue(request):

    serializer = IssueSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def get_issues(request):
    issues = Issue.objects.all().order_by("-created_at")  # latest first
    serializer = IssueSerializer(
    issues,
    many=True,
    context={"request": request}
)
    return Response(serializer.data)


@api_view(["GET"])
def get_issue_detail(request, id):
    try:
        issue = Issue.objects.get(id=id)
    except Issue.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

    
    serializer = IssueSerializer(
    issue,
    context={"request": request}
)
    return Response(serializer.data)




@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated]) 
def issue_comments(request, id):
    try:
        issue = Issue.objects.get(id=id)
    except Issue.DoesNotExist:
        return Response({"error": "Issue not found"}, status=404)

    if request.method == "GET":
        comments = Comment.objects.filter(issue=issue)
        serializer = CommentSerializer(comments, many=True)
        print(request.user)
        print(request.user.is_authenticated)
        return Response(serializer.data)

    if request.method == "POST":
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(issue=issue, user=request.user)
            print(request.user)
            print(request.user.is_authenticated)
            return Response(serializer.data)
        return Response(serializer.errors)
    
    

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def toggle_support(request, id):
    try:
        issue = Issue.objects.get(id=id)
    except Issue.DoesNotExist:
        return Response({"error": "Issue not found"}, status=404)

    user = request.user

    if issue.supporters.filter(id=user.id).exists():
        issue.supporters.remove(user)
        supported = False
    else:
        issue.supporters.add(user)
        supported = True

    return Response({
        "support_count": issue.supporters.count(),
        "is_supported": supported
    })