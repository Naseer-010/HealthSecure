from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    PATIENT = "PATIENT"
    DOCTOR = "DOCTOR"

    ROLE_CHOICES = [
        (PATIENT, "Patient"),
        (DOCTOR, "Doctor"),
    ]

    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    wallet_address = models.CharField(max_length=42, unique=True)

