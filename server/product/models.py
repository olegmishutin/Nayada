from django.db import models


class Product(models.Model):
    name = models.CharField(max_length=154)
    price = models.FloatField()
    weight = models.FloatField(null=True, blank=True)
    short_description = models.TextField(null=True, blank=True)
    date_added = models.DateTimeField(auto_now_add=True)
    count = models.BigIntegerField()

    class Meta:
        db_table = 'Product'
        verbose_name = 'Продукт'
        verbose_name_plural = 'Продукты'

    def __str__(self):
        return self.name


class ProductPhoto(models.Model):
    product = models.ForeignKey(Product, related_name='photos', on_delete=models.CASCADE)
    photo = models.ImageField(upload_to='product_photoes')

    class Meta:
        db_table = 'ProductPhoto'
        verbose_name = 'Фото продукции'
        verbose_name_plural = 'Фотографии продукции'

    def __str__(self):
        return self.product.name
