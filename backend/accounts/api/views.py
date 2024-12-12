from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer


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
                    "errors": {key: error[0] for key, error in serializer.errors.items()},
                }, status=status.HTTP_400_BAD_REQUEST,
            )
