from django.db import models
from user.models import User
from product.models import Product
from .managers import OrderManager


class Order(models.Model):
    statuses = {
        'Н': 'Новый',
        'О': 'В обработке',
        'В': 'Выполнен',
        'ОТ': 'Отменен'
    }

    user = models.ForeignKey(User, related_name='orders', on_delete=models.CASCADE, editable=False)
    identification_number = models.BigIntegerField(default=0, unique=True, editable=False)
    creation_time = models.DateTimeField(auto_now_add=True, editable=False)
    status = models.CharField(max_length=46, choices=statuses, default='Н')
    comment = models.TextField(null=True, blank=True)
    products = models.ManyToManyField(Product, related_name='orders', through='OrderProduct', editable=False)
    price = models.FloatField(default=0, editable=False)
    place = models.TextField()

    objects = OrderManager()

    class Meta:
        db_table = 'Order'
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'

    def __str__(self):
        return self.identification_number


class OrderRequest(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE)
    identification_number = models.BigIntegerField(default=0, unique=True, editable=False)

    objects = OrderManager()

    class Meta:
        db_table = 'OrderRequest'
        verbose_name = 'Запрос на заказ'
        verbose_name_plural = 'Запросы на заказы'

    def __str__(self):
        return self.identification_number


class OrderProduct(models.Model):
    order = models.ForeignKey(Order, related_name='orderProduct', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='orderProduct', on_delete=models.CASCADE)

    class Meta:
        db_table = 'OrderProduct'
        verbose_name = 'Продукт заказа'
        verbose_name_plural = 'Продукты заказов'
        unique_together = []


class Category(models.Model):
    name = models.CharField(max_length=128, unique=True)
    orders = models.ManyToManyField(Order, related_name='categories', db_table='OrderCategory')

    class Meta:
        db_table = 'Category'
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'

    def __str__(self):
        return self.name
