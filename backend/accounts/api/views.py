from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer


class RegisterAPIView(APIView):
    def post(self, request, *args, **kwargs):
        print(request.data)

        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            return Response(data={
                "message": "The registration was completed successfully.",
                "success": True,
                "data": serializer.data,
            }, status=status.HTTP_201_CREATED)

        else:
            return Response(
                data={
                    "message": "",
                    "success": false,
                    "data": serializer.errors,
                }, status=status.HTTP_400_BAD_REQUEST,
            )
