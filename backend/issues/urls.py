from django.urls import path
from .views import create_issue, get_citizen_issues, get_issue_detail, get_issues, get_resolved_issues, issue_comments, toggle_support, update_issue_status, get_authority_issues

urlpatterns = [
    path("report-issue/", create_issue),
    path("issues/", get_issues), 
    path("issues/<int:id>/", get_issue_detail),
    path("issues/<int:id>/comments/", issue_comments),
    path("issues/<int:id>/support/", toggle_support),
    path("issues/<int:id>/update/", update_issue_status),
    path("authority/issues/", get_authority_issues),
    path("my-issues/", get_citizen_issues),
    path("issues/resolved/", get_resolved_issues),
]