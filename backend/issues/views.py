from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model

from .serializers import IssueSerializer, CommentSerializer
from .models import Comment, Issue

User = get_user_model()


# ---------------- CREATE ISSUE ----------------
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_issue(request):

    data = request.data.copy()
    data["reporter_email"] = request.user.email

    serializer = IssueSerializer(
        data=data,
        context={"request": request}
    )

    if serializer.is_valid():
        serializer.save()
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


# ---------------- GET ALL ISSUES ----------------
@api_view(["GET"])
def get_issues(request):

    issues = Issue.objects.all().order_by("-created_at")

    serializer = IssueSerializer(
        issues,
        many=True,
        context={"request": request}
    )

    return Response(serializer.data)


# ---------------- ISSUE DETAIL ----------------
@api_view(["GET"])
def get_issue_detail(request, id):

    try:
        issue = Issue.objects.get(id=id)

    except Issue.DoesNotExist:
        return Response(
            {"error": "Not found"},
            status=404
        )

    serializer = IssueSerializer(
        issue,
        context={"request": request}
    )

    return Response(serializer.data)


# ---------------- COMMENTS ----------------
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def issue_comments(request, id):

    try:
        issue = Issue.objects.get(id=id)

    except Issue.DoesNotExist:
        return Response(
            {"error": "Issue not found"},
            status=404
        )

    # GET comments
    if request.method == "GET":

        comments = Comment.objects.filter(issue=issue)

        serializer = CommentSerializer(
            comments,
            many=True
        )

        return Response(serializer.data)

    # POST comment
    if request.method == "POST":

        serializer = CommentSerializer(
            data=request.data
        )

        if serializer.is_valid():

            serializer.save(
                issue=issue,
                user=request.user
            )

            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=400
        )


# ---------------- SUPPORT / UNSUPPORT ----------------
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def toggle_support(request, id):

    try:
        issue = Issue.objects.get(id=id)

    except Issue.DoesNotExist:
        return Response(
            {"error": "Issue not found"},
            status=404
        )

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


# ---------------- UPDATE ISSUE STATUS ----------------
@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_issue_status(request, id):

    try:
        issue = Issue.objects.get(id=id)

    except Issue.DoesNotExist:
        return Response(
            {"error": "Issue not found"},
            status=404
        )

    new_status = request.data.get("status")
    proof_image = request.FILES.get("proof")

    # only authority can update
    if request.user.role != "authority":
        return Response(
            {"error": "Only authority can update issue"},
            status=403
        )

    if new_status:
        issue.status = new_status

    if (
        new_status == "resolved"
        and proof_image
    ):
        issue.proof = proof_image

    issue.save()

    return Response({
        "message": "Updated successfully"
    })


# ---------------- AUTHORITY ISSUES ----------------
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_authority_issues(request):

    user = request.user

    # role check
    if user.role != "authority":
        return Response(
            {"detail": "Access denied"},
            status=403
        )

    authority_issues = Issue.objects.filter(
        assigned_authority=user
    ).order_by("-created_at")

    serializer = IssueSerializer(
        authority_issues,
        many=True,
        context={"request": request}
    )

    return Response(serializer.data)


# ---------------- CITIZEN ISSUES ----------------
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_citizen_issues(request):

    citizen_email = request.user.email

    issues = Issue.objects.filter(
        reporter_email=citizen_email
    ).order_by("-created_at")

    serializer = IssueSerializer(
        issues,
        many=True,
        context={"request": request}
    )

    return Response(serializer.data)


# ---------------- RESOLVED ISSUES ----------------
@api_view(["GET"])
def get_resolved_issues(request):

    issues = Issue.objects.filter(
        status="resolved"
    ).order_by("-created_at")

    serializer = IssueSerializer(
        issues,
        many=True,
        context={"request": request}
    )

    return Response(serializer.data)