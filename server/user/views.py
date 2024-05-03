from rest_framework import generics, permissions, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login as djangoLogin, logout
from .models import User
from . import serializers


class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = serializers.RegisterSerializer


class LoginUserView(APIView):
    def post(self, request, format=None):
        serializer = serializers.LoginSerializer(data=request.data)

        if serializer.is_valid(raise_exception=True):
            login = serializer.validated_data.get('login')
            password = serializer.validated_data.get('password')

            user = authenticate(login=login, password=password)
            if user:
                djangoLogin(request, user)
                return Response({'message': 'Успешно вошли в систему'}, status=status.HTTP_200_OK)
            return Response({'message': 'Пользователь не найден'}, status=status.HTTP_400_BAD_REQUEST)


class LogoutUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        logout(request)
        return Response({'message': 'Успешно вышли из системы'})


class UsersViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.UserSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        queryset = users = User.objects.all().defer('login', 'email', 'password')

        search = self.request.query_params.get('search')
        if search:
            users = queryset.filter(full_name__icontains=search)

            if not users.exists():
                users = queryset.filter(email__icontains=search)
        return users


class ProfileView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all().defer('is_superuser', 'is_staff', 'is_worker', 'password', 'last_login')
    serializer_class = serializers.ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
