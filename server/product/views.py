from rest_framework import viewsets
from .models import Product, ProductPhoto
from .serializers import ProductSerializer, ProductPhotoSerializer
from .permissions import IsWorkerOrAdmin


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsWorkerOrAdmin]


class ProductPhotoViewSet(viewsets.ModelViewSet):
    queryset = ProductPhoto.objects.all()
    serializer_class = ProductPhotoSerializer
    permission_classes = [IsWorkerOrAdmin]
