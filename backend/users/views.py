from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView

from django.contrib.auth.hashers import check_password
from django.db.models import Q
from django.utils import timezone

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from .models import User, Category, AuthorityRequest
from .serializers import (
    CategorySerializer,
    UserSerializer,
    AuthorityRequestSerializer
)


# ---------------- CITIZEN SIGNUP ----------------
@api_view(['POST'])
def citizen_signup(request):

    data = request.data.copy()
    data["role"] = "citizen"

    serializer = UserSerializer(data=data)

    if serializer.is_valid():

        user = serializer.save()

        # Auto login
        user.is_online = True
        user.last_login = timezone.now()
        user.save()

        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "Citizen signup successful",
            "role": user.role,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email
            }
        }, status=201)

    return Response(serializer.errors, status=400)


# ---------------- LOGIN ----------------
@api_view(['POST'])
def login_user(request):

    login_input = request.data.get("login")
    password = request.data.get("password")

    try:
        user = User.objects.get(
            Q(email=login_input) |
            Q(username=login_input)
        )


        
        print("Typed password:", password)
        print("DB password:", user.password)
        print(
            "Password check:",
            check_password(password, user.password)
        )

        if check_password(password, user.password):

            user.is_online = True
            user.last_login = timezone.now()
            user.save()

            refresh = RefreshToken.for_user(user)

            return Response({
                "message": "Login successful",
                "role": user.role,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email
                }
            })

        else:
            return Response({
                "password": ["Incorrect password"]
            }, status=400)

    except User.DoesNotExist:
        pass

    # Check authority request status
    try:
        request_user = AuthorityRequest.objects.get(
            Q(email=login_input) |
            Q(username=login_input)
        )

        if request_user.status == "pending":
            return Response({
                "login": [
                    "Your authority request is still under review"
                ]
            }, status=400)

        elif request_user.status == "rejected":
            return Response({
                "login": [
                    "Your authority request was rejected"
                ]
            }, status=400)

    except AuthorityRequest.DoesNotExist:
        pass

    return Response({
        "login": ["Account not found"]
    }, status=400)


# ---------------- AUTHORITY SIGNUP ----------------
@api_view(['POST'])
def authority_signup(request):

    serializer = AuthorityRequestSerializer(
        data=request.data
    )

    if serializer.is_valid():

        serializer.save()

        return Response(
            {
                "message":
                "Access request submitted"
            },
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


# ---------------- LOGOUT ----------------
@api_view(['POST'])
def logout_user(request):

    try:

        refresh_token = request.data.get(
            "refresh"
        )

        user_id = request.data.get(
            "user_id"
        )

        token = RefreshToken(
            refresh_token
        )

        user = User.objects.get(
            id=user_id
        )

        user.is_online = False
        user.last_logout = timezone.now()
        user.save()

        # blacklist token
        token.blacklist()

        return Response({
            "message":
            "Logout successful"
        }, status=200)

    except TokenError:

        return Response({
            "error":
            "Invalid token"
        }, status=400)

    except Exception as e:

        return Response({
            "error":
            str(e)
        }, status=400)


# ---------------- CATEGORY LIST ----------------
class CategoryListView(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer





from django.db import connection


@api_view(['GET'])
def db_check(request):
    return Response({
        "engine": connection.settings_dict["ENGINE"],
        "name": connection.settings_dict["NAME"]
    })



