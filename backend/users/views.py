from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Citizen, Authority, AuthorityRequest
from .serializers import CitizenSerializer, AuthoritySerializer
from rest_framework import status
from django.contrib.auth.hashers import check_password

from django.db.models import Q
from .serializers import AuthorityRequestSerializer
from django.utils import timezone



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
def login_user(request):
    login_input = request.data.get("login")
    password = request.data.get("password")

    # ----------- CITIZEN LOGIN -----------
    try:
        citizen = Citizen.objects.get(Q(email=login_input) | Q(username=login_input))

        if check_password(password, citizen.password):
            citizen.is_online = True
            citizen.last_login = timezone.now()
            citizen.save()

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
            return Response({"password": ["Incorrect password"]}, status=400)
    except Citizen.DoesNotExist:
        pass  # continue to authority check

    # ----------- AUTHORITY LOGIN -----------
    try:
        authority = Authority.objects.get(Q(email=login_input) | Q(username=login_input))

        if check_password(password, authority.password):
            authority.is_online = True
            authority.last_login = timezone.now()
            authority.save()

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
            return Response({"password": ["Incorrect password"]}, status=400)
    except Authority.DoesNotExist:
        pass

    # ----------- AUTHORITY REQUEST STATUS -----------
    try:
        request_user = AuthorityRequest.objects.get(Q(email=login_input) | Q(username=login_input))
        if request_user.status == "pending":
            return Response({"login": ["Your authority request is still under review"]}, status=400)
        elif request_user.status == "rejected":
            return Response({"login": ["Your authority request was rejected"]}, status=400)
    except AuthorityRequest.DoesNotExist:
        pass

    # ----------- NO ACCOUNT FOUND -----------
    return Response({"login": ["Account not found"]}, status=400)



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

@api_view(['POST'])
def logout_user(request):

    username = request.data.get("username")

    try:
        citizen = Citizen.objects.get(username=username)

        citizen.is_online = False
        citizen.last_logout = timezone.now()
        citizen.save()

        return Response({"message": "Citizen logged out"})

    except Citizen.DoesNotExist:
        pass


    try:
        authority = Authority.objects.get(username=username)

        authority.is_online = False
        authority.last_logout = timezone.now()
        authority.save()

        return Response({"message": "Authority logged out"})

    except Authority.DoesNotExist:
        pass


    return Response({"message": "User not found"}, status=404)

