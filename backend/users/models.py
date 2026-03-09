from django.db import models

# Citizen model
class Citizen(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    username = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=128)

    def __str__(self):
        return self.username


class AuthorityRequest(models.Model):

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)

    username = models.CharField(max_length=50, unique=True)

    department = models.CharField(max_length=100)
    employee_id = models.CharField(max_length=50)

    office_address = models.CharField(max_length=200)

    document = models.FileField(upload_to="authority_documents/")

    password = models.CharField(max_length=128)

    status = models.CharField(
        max_length=20,
        choices=[
            ("pending","Pending"),
            ("approved","Approved"),
            ("rejected","Rejected")
        ],
        default="pending"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):

        # if request is approved create authority account
        if self.status == "approved":

            if not Authority.objects.filter(username=self.username).exists():

                Authority.objects.create(
                    first_name=self.first_name,
                    last_name=self.last_name,
                    email=self.email,
                    phone=self.phone,
                    username=self.username,
                    department=self.department,
                    employee_id=self.employee_id,
                    office_address=self.office_address,
                    document=self.document,
                    password=self.password
                )

        super().save(*args, **kwargs)


    def __str__(self):
        return self.username


# Authority model
class Authority(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    username = models.CharField(max_length=50, unique=True)
    department = models.CharField(max_length=100)
    employee_id = models.CharField(max_length=50)
    office_address = models.TextField()
    document = models.FileField(upload_to="authority_docs/")
    password = models.CharField(max_length=128)

    def __str__(self):
        return self.username