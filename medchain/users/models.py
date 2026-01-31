from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('PATIENT', 'Patient'),
        ('DOCTOR', 'Doctor'),
    )

    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    wallet_address = models.CharField(max_length=255, blank=True, null=True)

    doctor_certificate = models.FileField(
        upload_to='doctor_certificates/',
        blank=True,
        null=True
    )

    is_verified_doctor = models.BooleanField(default=False)
