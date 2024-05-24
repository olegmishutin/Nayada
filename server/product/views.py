from rest_framework import viewsets
from .models import Product, ProductPhoto
from .serializers import ProductSerializer, ProductPhotoSerializer
from .permissions import IsWorkerOrAdmin


# Представление для манипулирование продуктами
class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [IsWorkerOrAdmin]

    def get_queryset(self):
        params = self.request.query_params  # Получение параметров из запроса

        filtersCheckboxex = {'new': '-date_added',
                             'old': 'date_added',
                             'expensive': '-price',
                             'cheap': 'price'}  # Словарь фильтров ('параметр запроса': 'фильтр для бд')
        filter = [value for key, value in filtersCheckboxex.items() if params.get(key)]

        smallestPrice = params.get('smallestPrice') or 0
        greatestPrice = params.get('greatestPrice') or 0

        # Фильтр по цене (от какой до какой цены)
        products = Product.objects.all()
        if smallestPrice and greatestPrice:
            products = products.filter(price__gte=smallestPrice, price__lte=greatestPrice)
        elif smallestPrice:
            products = products.filter(price__gte=smallestPrice)
        elif greatestPrice:
            products = products.filter(price__lte=greatestPrice)

        return products.order_by(*filter).prefetch_related('photos') if filter else products


# Представление для манипулирование фотографиями продуктов
class ProductPhotoViewSet(viewsets.ModelViewSet):
    queryset = ProductPhoto.objects.all()
    serializer_class = ProductPhotoSerializer
    permission_classes = [IsWorkerOrAdmin]
