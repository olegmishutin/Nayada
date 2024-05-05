from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Order, Category
from .serializers import UserOrderSerializer, CategorySerializer, WorkOrderSerializer
from .permissions import IsOwnerAndSafeStatus, WorkerOrderPermission
from product.permissions import IsWorkerOrAdmin


class UserOrderViewSet(viewsets.ModelViewSet):
    serializer_class = UserOrderSerializer
    permission_classes = [IsAuthenticated, IsOwnerAndSafeStatus]

    def get_queryset(self):
        return self.filter_queryset(
            self.request.user.orders.all().prefetch_related(
                'categories', 'products', 'products__photos'))

    def filter_queryset(self, queryset):
        params = self.request.query_params
        filtersCheckboxex = {'expensive': '-price', 'cheap': 'price'}

        filter = [value for key, value in filtersCheckboxex.items() if params.get(key)]
        return queryset.order_by(*filter)


class WorkerOrderViewSet(UserOrderViewSet):
    serializer_class = WorkOrderSerializer
    permission_classes = [IsWorkerOrAdmin, WorkerOrderPermission]

    def get_queryset(self):
        return self.filter_queryset(
            Order.objects.all().prefetch_related(
                'categories', 'products', 'products__photos').select_related('user'))


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsWorkerOrAdmin]
