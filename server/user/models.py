import os
from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from .managers import CustomUserManager


class User(AbstractBaseUser):
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_worker = models.BooleanField(default=False)

    full_name = models.CharField(max_length=250)
    photo = models.ImageField(upload_to='users_photos/', null=True, blank=True)
    telephone = models.BigIntegerField(null=True, blank=True)

    login = models.CharField(max_length=128, unique=True, db_index=True, editable=False)
    email = models.EmailField()

    USERNAME_FIELD = 'login'
    REQUIRED_FIELDS = ['full_name', 'email']

    objects = CustomUserManager()

    class Meta:
        db_table = 'User'
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'

    def delete(self, using=None, keep_parents=False):
        if self.photo and os.path.exists(self.photo.path):
            os.remove(self.photo.path)

        return super(User, self).delete(using=using, keep_parents=keep_parents)

    def __str__(self):
        return self.login
