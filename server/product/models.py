import os
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

    def delete(self, using=None, keep_parents=False):
        for photo in self.photos.all():
            photo.delete()

        return super(Product, self).delete(using=using, keep_parents=keep_parents)

    def __str__(self):
        return self.name


def save_product_photo(instance, filename):
    return f'product_{instance.product.id}_photos/{filename}'


class ProductPhoto(models.Model):
    product = models.ForeignKey(Product, related_name='photos', on_delete=models.CASCADE)
    photo = models.ImageField(upload_to=save_product_photo)

    class Meta:
        db_table = 'ProductPhoto'
        verbose_name = 'Фото продукции'
        verbose_name_plural = 'Фотографии продукции'

    def delete(self, using=None, keep_parents=False):
        if self.photo and os.path.exists(self.photo.path):
            os.remove(self.photo.path)

        return super(ProductPhoto, self).delete(using=using, keep_parents=keep_parents)

    def __str__(self):
        return self.product.name
