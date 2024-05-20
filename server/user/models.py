import os
from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from .managers import CustomUserManager


# Модель пользователя
class User(AbstractBaseUser):
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_worker = models.BooleanField(default=False)

    full_name = models.CharField(max_length=250)
    photo = models.ImageField(upload_to='users_photos/', null=True, blank=True)
    telephone = models.BigIntegerField(null=True, blank=True)

    login = models.CharField(max_length=128, unique=True, db_index=True)
    email = models.EmailField()

    USERNAME_FIELD = 'login'
    REQUIRED_FIELDS = ['full_name', 'email']  # Обязательные поля

    # Установка менеджера модели
    objects = CustomUserManager()

    # Мета-данные о таблице
    class Meta:
        db_table = 'User'  # Название таблицы в бд
        verbose_name = 'Пользователь'  # Название таблицы для системы (ед.число)
        verbose_name_plural = 'Пользователи'  # Название таблицы для системы (множ.число)
        ordering = ['-id']

    # Перепись метода delete, для удаления пользователя
    def delete(self, using=None, keep_parents=False):
        # Удалаемя фото пользователя из папки медиа, если она есть
        if self.photo and os.path.exists(self.photo.path):
            os.remove(self.photo.path)

        # Вызваем и возвращаем дефолтное удаление django
        return super(User, self).delete(using=using, keep_parents=keep_parents)

    # Перегрузка метода str для красоты содержания данныз запросов (queryset)
    def __str__(self):
        return self.login
