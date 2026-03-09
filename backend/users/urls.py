from django.urls import path
from .views import citizen_signup, authority_signup,citizen_login


urlpatterns = [
    path('citizen/signup/', citizen_signup),
    path('authority/signup/', authority_signup),
    path("citizen/login/", citizen_login),
    
]