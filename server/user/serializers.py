from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import User


# Сериалайзер для регистрации пользователя (принимает, возвращает и обрабатывает данные, проводит операции с БД)
class RegisterSerializer(serializers.ModelSerializer):
    login = serializers.CharField(max_length=128, required=True)

    class Meta:
        model = User  # Какая модель используется
        fields = ['login', 'email', 'password', 'full_name']  # Какие поля модели используются

    # Метод проверки данных
    def validate(self, data):
        data = super(RegisterSerializer, self).validate(data)

        login = data.get('login')
        password = data.get('password')
        email = data.get('email')
        fullName = data.get('full_name')

        splitedFullName = fullName.split(' ')

        if len(password) < 8:
            raise serializers.ValidationError({'password': ['Пароль не должен быть короче 8 символов']})

        if any(partOfName in password for partOfName in splitedFullName):
            raise serializers.ValidationError({'password': ['Пароль не должен содержать полное имя']})

        if login in password:
            raise serializers.ValidationError({'password': ['Пароль не должен содержать логин']})

        if email in password:
            raise serializers.ValidationError({'password': ['Пароль не должен содержать email адрес']})

        if not any(char.isupper() for char in password):
            raise serializers.ValidationError({'password': ['Пароль должен содержать хотябы одну заглавную букву']})

        if not any(char.isdigit() for char in password):
            raise serializers.ValidationError({'password': ['Пароль должен содержать хотябы одно число']})
        return data

    # Метод вызываемый в случае POST запроса, то есть создание
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


# Сериалайзер для логирования пользователя (здесь просто проверяется, что данные введены правильно)
class LoginSerializer(serializers.ModelSerializer):
    login = serializers.CharField(max_length=128, required=True)

    class Meta:
        model = User
        fields = ['login', 'password']


# Сериалайзер для управления пользователями админом
class UserSerializer(serializers.ModelSerializer):
    login = serializers.CharField(
        required=True, max_length=128, validators=[UniqueValidator(queryset=User.objects.all())])
    password = serializers.CharField(max_length=128, write_only=True)  # Пароль доступен только для записи

    class Meta:
        model = User
        fields = '__all__'

    # Перепись метода обновления, чтобы админ не мог поменять пароль у пользователей
    def update(self, instance, validated_data):
        validated_data.pop('password')
        return super(UserSerializer, self).update(instance, validated_data)

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


# Сериалайзер для профиля пользователя
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Поля, которые не должны использоваться в сериалайзере
        exclude = ['is_superuser', 'is_staff', 'is_worker', 'password', 'last_login']
