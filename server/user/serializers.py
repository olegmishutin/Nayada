from rest_framework import serializers
from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['login', 'email', 'password', 'full_name']

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
            raise serializers.ValidationError({'password': ['Пароль не должен содержать ваше полное имя']})

        if login in password:
            raise serializers.ValidationError({'password': ['Праоль не должен содержать ваш логин']})

        if email in password:
            raise serializers.ValidationError({'password': ['Пароль не должен содержать ваш email адрес']})

        if not any(char.isupper() for char in password):
            raise serializers.ValidationError({'password': ['Пароль должен содержать хотябы одну заглавную букву']})

        if not any(char.isdigit() for char in password):
            raise serializers.ValidationError({'password': ['Пароль должен содержать хотябы одно число']})

        return data

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.ModelSerializer):
    login = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ['login', 'password']
