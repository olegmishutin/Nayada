from django.urls import path, include
from rest_framework.routers import SimpleRouter
from rest_framework.permissions import IsAuthenticated
from . import views

router = SimpleRouter()
router.register('admin-products', views.ProductViewSet, basename='admin-products')

app_name = 'product'
urlpatterns = [
    path('', include(router.urls)),
    path('admin-product-photos/', views.ProductPhotoViewSet.as_view({
        'post': 'create'
    })),
    path('admin-product-photo/<int:pk>/', views.ProductPhotoViewSet.as_view({
        'delete': 'destroy'
    })),
    path('products/', views.ProductViewSet.as_view(
        {'get': 'list'},
        permission_classes=[IsAuthenticated]
    ), name='products'),
]
