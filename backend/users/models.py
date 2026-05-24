from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    BaseUserManager
)


# ---------------- USER MANAGER ----------------

class UserManager(BaseUserManager):

    def create_user(
        self,
        username,
        email,
        password=None,
        **extra_fields
    ):

        if not email:
            raise ValueError("Email is required")

        email = self.normalize_email(email)

        user = self.model(
            username=username,
            email=email,
            **extra_fields
        )

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(
        self,
        username,
        email,
        password=None,
        **extra_fields
    ):

        extra_fields.setdefault("is_staff", True)

        extra_fields.setdefault("is_superuser", True)

        return self.create_user(
            username,
            email,
            password,
            **extra_fields
        )


# ---------------- CATEGORY ----------------

class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


# ---------------- CUSTOM USER ----------------

class User(
    AbstractBaseUser,
    PermissionsMixin
):

    ROLE_CHOICES = [
        ("citizen", "Citizen"),
        ("authority", "Authority")
    ]

    # common fields
    username = models.CharField(max_length=50,unique=True)

    email = models.EmailField(unique=True)

    phone = models.CharField(max_length=15)

    role = models.CharField(max_length=20,choices=ROLE_CHOICES)

    # citizen field
    full_name = models.CharField(max_length=100,blank=True,null=True)

    # authority fields
    first_name = models.CharField(max_length=50,blank=True,null=True)

    last_name = models.CharField( max_length=50,blank=True,null=True)

    category = models.ForeignKey(Category,on_delete=models.SET_NULL,null=True,blank=True)



    area = models.CharField(max_length=100,blank=True,null=True)

    employee_id = models.CharField(max_length=50,blank=True,null=True)

    office_address = models.TextField(blank=True,null=True)

    document = models.FileField(upload_to="authority_docs/",blank=True,null=True)

    # auth fields
    is_online = models.BooleanField(default=False)

    last_login = models.DateTimeField(null=True,blank=True)

    last_logout = models.DateTimeField(null=True,blank=True)

    is_active = models.BooleanField(default=True)

    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.username


# ---------------- AUTHORITY REQUEST ----------------

class AuthorityRequest(models.Model):

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected")
    ]

    first_name = models.CharField(max_length=100)

    last_name = models.CharField(max_length=100)

    email = models.EmailField(unique=True)

    phone = models.CharField(max_length=15)

    username = models.CharField(max_length=50,unique=True)

    pincode = models.CharField( max_length=10)

    category = models.ForeignKey(Category,on_delete=models.CASCADE)

    area = models.CharField(max_length=100)

    employee_id = models.CharField(max_length=50)

    office_address = models.CharField(max_length=200)

    document = models.FileField(upload_to="authority_documents/")

    password = models.CharField(max_length=128)

    status = models.CharField(max_length=20,choices=STATUS_CHOICES,default="pending")

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):

        if self.status == "approved":

            if not User.objects.filter(
                username=self.username
            ).exists():

                user = User(
                    username=self.username,
                    email=self.email,
                    phone=self.phone,
                    role="authority",
                    first_name=self.first_name,
                    last_name=self.last_name,
                    category=self.category,
                    area=self.area,
                    employee_id=self.employee_id,
                    office_address=self.office_address,
                    document=self.document
                )

                user.password = self.password
                user.save()

                # import here (avoid circular import)
                from issues.models import Issue

                # find old unassigned issues
                
                unassigned_issues = Issue.objects.filter(
                    assigned_authority__isnull=True,
                    category=self.category,
                    pincode=self.pincode
                )

                # assign to new authority
                for issue in unassigned_issues:
                    issue.assigned_authority = user
                    issue.save()

        super().save(*args, **kwargs)

    

    def __str__(self):
        return self.username