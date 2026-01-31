from django.urls import path
from .views import GrantAccess, RevokeAccess

urlpatterns = [
    path("grant/", GrantAccess.as_view()),
    path("revoke/", RevokeAccess.as_view()),
]
