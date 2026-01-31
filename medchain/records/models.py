from django.db import models
from accounts.models import User


class MedicalRecord(models.Model):
    patient = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="patient_records"
    )
    doctor = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="doctor_records"
    )

    ipfs_cid = models.TextField()
    file_hash = models.CharField(max_length=256)

    is_visible = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
