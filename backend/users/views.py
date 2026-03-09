from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Citizen, Authority
from .serializers import CitizenSerializer, AuthoritySerializer
from rest_framework import status
from django.contrib.auth.hashers import check_password

from django.db.models import Q
from .serializers import AuthorityRequestSerializer



@api_view(['POST'])
def citizen_signup(request):

    serializer = CitizenSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Signup successful"},
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
def citizen_login(request):

    login_input = request.data.get("login")
    password = request.data.get("password")

    # ---------- CITIZEN LOGIN ----------
    try:
        citizen = Citizen.objects.get(
            Q(email=login_input) | Q(username=login_input)
        )

        if check_password(password, citizen.password):

            return Response({
                "message": "Citizen login successful",
                "role": "citizen",
                "user": {
                    "id": citizen.id,
                    "username": citizen.username,
                    "email": citizen.email
                }
            })

        else:
            return Response(
                {"password": ["Incorrect password"]},
                status=400
            )

    except Citizen.DoesNotExist:
        pass


    # ---------- AUTHORITY LOGIN ----------
    try:
        authority = Authority.objects.get(
            Q(email=login_input) | Q(username=login_input)
        )

        if check_password(password, authority.password):

            return Response({
                "message": "Authority login successful",
                "role": "authority",
                "user": {
                    "id": authority.id,
                    "username": authority.username,
                    "email": authority.email
                }
            })

        else:
            return Response(
                {"password": ["Incorrect password"]},
                status=400
            )

    except Authority.DoesNotExist:
        pass


    # ---------- CHECK REQUEST STATUS ----------
    from .models import AuthorityRequest

    try:
        request_user = AuthorityRequest.objects.get(
            Q(email=login_input) | Q(username=login_input)
        )

        if request_user.status == "pending":

            return Response(
                {"login": ["Your authority request is still under review"]},
                status=400
            )

        elif request_user.status == "rejected":

            return Response(
                {"login": ["Your authority request was rejected"]},
                status=400
            )

    except AuthorityRequest.DoesNotExist:
        pass


    return Response(
        {"login": ["Account not found"]},
        status=400
    )



@api_view(['POST'])
def authority_signup(request):

    serializer = AuthorityRequestSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Access request submitted"},
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)