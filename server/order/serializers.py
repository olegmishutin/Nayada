from django.db.models import Sum
from rest_framework import serializers
from .models import Order, OrderProduct, Category
from product.serializers import ProductSerializer


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        exclude = ['orders']


class UserOrderSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    status = serializers.ReadOnlyField()
    categories = CategorySerializer(many=True, read_only=True)
    products = ProductSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = '__all__'
        depth = 1

    def to_internal_value(self, data):
        newData = super(UserOrderSerializer, self).to_internal_value(data)

        products = data.get('products')
        if not products:
            raise serializers.ValidationError({'products': ['Не выбрано ни одного продукта']})

        newData.update({'products': products})
        return newData

    def addProductsInOrder(self, order, products):
        orderProducts = [OrderProduct(order=order, product_id=product) for product in products]
        OrderProduct.objects.bulk_create(orderProducts)

        order.price = order.products.all().aggregate(priceSum=Sum('price'))['priceSum']
        order.save(update_fields=['price'])

    def update(self, instance, validated_data):
        products = validated_data.pop('products', [])

        instance.products.clear()
        self.addProductsInOrder(instance, products)

        return super(UserOrderSerializer, self).update(instance, validated_data)

    def create(self, validated_data):
        user = self.context['request'].user

        products = validated_data.pop('products', [])
        order = Order.objects.create(user=user, **validated_data)

        self.addProductsInOrder(order, products)
        return order


class WorkOrderSerializer(serializers.ModelSerializer):
    comment = serializers.ReadOnlyField()
    place = serializers.ReadOnlyField()
    categories = CategorySerializer(many=True, read_only=True)
    products = ProductSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = '__all__'
        depth = 1

    def to_internal_value(self, data):
        newData = super(WorkOrderSerializer, self).to_internal_value(data)
        newData.update({'categories': data.get('categories')})
        return newData

    def update(self, instance, validated_data):
        categories = validated_data.pop('categories', [])

        if categories:
            instance.categories.add(*categories)

        return super(WorkOrderSerializer, self).update(instance, validated_data)
