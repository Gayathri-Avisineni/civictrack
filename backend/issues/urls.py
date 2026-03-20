from django.urls import path
from .views import create_issue, get_issue_detail, get_issues, issue_comments, toggle_support

urlpatterns = [
    path("report-issue/", create_issue),
    path("issues/", get_issues), 
    path("issues/<int:id>/", get_issue_detail),
    path("issues/<int:id>/comments/", issue_comments),
    path("issues/<int:id>/support/", toggle_support),
]