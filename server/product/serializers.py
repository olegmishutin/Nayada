from django.db.models import Sum
from rest_framework import serializers
from .models import Product, ProductPhoto


class ProductPhotoSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())

    class Meta:
        model = ProductPhoto
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    photos = ProductPhotoSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = '__all__'

    def update(self, instance, validated_data):
        updatedProduct = super(ProductSerializer, self).update(instance, validated_data)
        productOrders = instance.orderProduct.all().select_related('order')

        for orderProduct in productOrders:
            order = orderProduct.order
            order.price = order.products.all().aggregate(priceSum=Sum('price'))['priceSum']
            order.save(update_fields=['price'])
        return updatedProduct

    def create(self, validated_data):
        if self.initial_data.get('photos'):
            photos = self.initial_data.pop('photos', [])
            product = Product.objects.create(**validated_data)

            for photo in photos:
                ProductPhoto.objects.create(product=product, photo=photo)

            return product
        raise serializers.ValidationError({'photos': ['Нужна хотябы одна фотография.']})
