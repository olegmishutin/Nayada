from django.db import models
from django.contrib.auth.models import AbstractBaseUser, AbstractUser
from .managers import CustomUserManager


class User(AbstractBaseUser):
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_worker = models.BooleanField(default=False)

    full_name = models.CharField(max_length=300)
    photo = models.ImageField(upload_to='users_photos/', null=True, blank=True)
    telephone = models.BigIntegerField(null=True, blank=True)

    login = models.CharField(unique=True, db_index=True)
    email = models.EmailField()

    USERNAME_FIELD = 'login'
    REQUIRED_FIELDS = ['full_name', 'email']

    objects = CustomUserManager()

    class Meta:
        db_table = 'User'
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
