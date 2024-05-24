from rest_framework import generics, permissions, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.contrib.auth import authenticate, login as djangoLogin, logout
from .models import User
from . import serializers


# Конечная точка API (представление) для предоставления типа пользователя
@api_view(['GET'])
def getUserType(request, format=None):
    user = request.user

    if user.is_authenticated:
        if user.is_staff:
            return Response({'user_type': 'staff'}, status=status.HTTP_200_OK)
        elif user.is_worker:
            return Response({'user_type': 'worker'}, status=status.HTTP_200_OK)
        else:
            return Response({'user_type': 'user'}, status=status.HTTP_200_OK)
    return Response({'user_type': 'anon'}, status=status.HTTP_200_OK)


# Конечная точка API (представление) для регистрации пользотвателя
class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()  # Набор запросов для использования
    serializer_class = serializers.RegisterSerializer  # Сериалайзер для данного представления


# Конечная точка API (представление) для логирования пользотвателя
class LoginUserView(APIView):
    # Обработчик метода запроса POST
    def post(self, request, format=None):
        # Проверка данных через сериалайзер
        serializer = serializers.LoginSerializer(data=request.data)

        if serializer.is_valid(raise_exception=True):
            # Получение проверенных данных
            login = serializer.validated_data.get('login')
            password = serializer.validated_data.get('password')

            # Нахождение и логирование пользователя
            user = authenticate(login=login, password=password)
            if user:
                djangoLogin(request, user)
                return Response({'message': 'Успешно вошли в систему'}, status=status.HTTP_200_OK)
            return Response({'message': 'Пользователь не найден'}, status=status.HTTP_400_BAD_REQUEST)


# Конечная точка API (представление) для выхода пользотвателя из системы
class LogoutUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]  # Разрешения на использование данной точки API

    # Обработчик метода запроса GET
    def get(self, request, format=None):
        logout(request)  # Выход из системы
        return Response({'message': 'Успешно вышли из системы'}, status=status.HTTP_200_OK)


# Конечная точка API (представление) для управления пользователями админом
class UsersViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.UserSerializer
    permission_classes = [permissions.IsAdminUser]

    # Метод получения набора запросов для использования
    def get_queryset(self):
        queryset = users = User.objects.all()  # Получаем всех пользователей
        search = self.request.query_params.get('search')  # Получаем параметр поиска

        # Фильтруем набор запросов по параметру поиска
        if search:
            users = queryset.filter(full_name__icontains=search)

            if not users.exists():
                users = queryset.filter(email__icontains=search)
        return users


# Конечная точка API (представление) для профиля пользователя
class ProfileView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all().defer('is_superuser', 'is_staff', 'is_worker', 'password', 'last_login')
    serializer_class = serializers.ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    # Метод получения объекта, над которым проводятся действия
    def get_object(self):
        return self.request.user  # Возарвщаем текущего пользователя
