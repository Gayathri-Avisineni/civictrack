from django.urls import path
from .views import citizen_signup, authority_signup, login_user, logout_user


urlpatterns = [
    path('citizen/signup/', citizen_signup),
    path('authority/signup/', authority_signup),
    path("citizen/login/", login_user),
    path("logout/", logout_user),
]