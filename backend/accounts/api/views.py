from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer, LoginSerializer
from django.contrib.auth import authenticate, login, logout
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.sessions.models import Session


class RegisterAPIView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(data={
                "message": "Registration was successful, please check your inbox to verify your account.",
                "success": True,
                "data": serializer.data,
            }, status=status.HTTP_201_CREATED)

        else:
            return Response(
                data={
                    "message": "There was an issue with the registration. Please check the provided data and try again.",
                    "success": False,
                    "errors": {
                        key: error[0] for key, error in serializer.errors.items()
                    },
                }, status=status.HTTP_400_BAD_REQUEST,
            )


class LoginAPIView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            remember = serializer.validated_data.get("remember", False)

            user = authenticate(
                request=request,
                username=serializer.validated_data.get("username"),
                password=serializer.validated_data.get("password"),
            )

            if user is not None:
                login(
                    request=request,
                    user=user
                )

                if remember:
                    request.session.set_expiry(7 * 24 * 60 * 60)

                refresh = RefreshToken.for_user(user=user)
                access_token = str(refresh.access_token)

                return Response(
                    data={
                        "message": "Login was successful.",
                        "success": True,
                        "data": serializer.data,
                        "access_token": access_token,
                    },
                    status=status.HTTP_200_OK,
                )

            else:
                return Response(
                    data={
                        "message": "Invalid username or password.",
                        "success": False,
                    },
                    status=status.HTTP_401_UNAUTHORIZED,
                )

        else:
            return Response(
                data={
                    "message": "There was an issue with logging in. Please check the provided information and try again.",
                    "success": False,
                    "errors": {
                        key: error[0] for key, error in serializer.errors.items()
                    },
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


class LogoutAPIView(APIView):
    def post(self, request, *args, **kwargs):
        logout(request=request)

        request.session.flush()

        return Response(
            data={
                "message": "Logout was successful.",
                "success": True,
            },
            status=status.HTTP_200_OK,
        )
