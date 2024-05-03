from django.db import models
from user.models import User
from product.models import Product
from .managers import OrderManager


class Order(models.Model):
    statuses = {
        'Р': 'Рассмотрение',
        'С': 'Склад',
        'Д': 'Доставка',
        'П': 'Получено'
    }

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    identification_number = models.BigIntegerField(default=0, unique=True)
    creation_time = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=46, choices=statuses, default=statuses['Р'])
    comment = models.TextField(null=True, blank=True)
    products = models.ManyToManyField(Product, related_name='orders', db_table='OrderProduct')

    objects = OrderManager()

    class Meta:
        db_table = 'Order'
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'

    def __str__(self):
        return self.identification_number


class Category(models.Model):
    name = models.CharField(max_length=128, unique=True)
    orders = models.ManyToManyField(Order, related_name='categories', db_table='OrderCategory')

    class Meta:
        db_table = 'Category'
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'

    def __str__(self):
        return self.name
