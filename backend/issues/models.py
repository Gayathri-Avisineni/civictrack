from django.db import models
from users.models import Category, Authority
from django.contrib.auth.models import User

class Issue(models.Model):

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("in_progress", "In Progress"),
        ("resolved", "Resolved"),
    ]

    title = models.CharField(max_length=200)

    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE
    )

    description = models.TextField()

    address = models.TextField()

    area = models.CharField(max_length=100)

    pincode = models.CharField(max_length=10)

    latitude = models.FloatField()

    longitude = models.FloatField()

    assigned_authority = models.ForeignKey(
        Authority,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )


    reporter_name = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    reporter_email = models.EmailField()

    photo = models.ImageField(upload_to="issue_photos/")

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    supporters = models.ManyToManyField(User, blank=True, related_name="supported_issues")

    def __str__(self):
        return self.title





class Comment(models.Model):
    issue = models.ForeignKey("Issue", on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.text[:20]