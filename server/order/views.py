from rest_framework import viewsets
from rest_framework.mixins import UpdateModelMixin
from rest_framework.permissions import IsAuthenticated
from .models import Order, Category, OrderRequest
from . import serializers
from .permissions import IsOwnerAndSafeStatus
from product.permissions import IsWorkerOrAdmin


def filter_queryset(queryset, params):
    retQueryset = queryset
    status = params.get('status')
    filtersCheckboxex = {'expensive': '-price', 'cheap': 'price'}

    categories = Category.objects.all()
    categoriesForFilter = [
        category for category in categories if params.get(f'category-{category.id}')]

    if categoriesForFilter:
        retQueryset = queryset.filter(categories__in=categoriesForFilter)

    if status:
        retQueryset = retQueryset.filter(status=status)

    filter = [value for key, value in filtersCheckboxex.items() if params.get(key)]
    return retQueryset.order_by(*filter)


class UserOrderRequestViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = serializers.UserOrderRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return OrderRequest.objects.filter(
            order__user=self.request.user).select_related(
            'order').prefetch_related('order__user', 'order__products', 'order__categories', 'order__products__photos')


class WorkerOrderRequestViewSet(UpdateModelMixin, UserOrderRequestViewSet):
    queryset = OrderRequest.objects.all().select_related(
        'order').prefetch_related('order__user', 'order__products', 'order__categories', 'order__products__photos')

    serializer_class = serializers.WorkerOrderRequestSerializer
    permission_classes = [IsWorkerOrAdmin]


class UserOrderViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.UserOrderSerializer
    permission_classes = [IsAuthenticated, IsOwnerAndSafeStatus]

    def get_queryset(self):
        return filter_queryset(
            self.request.user.orders.filter(request__status='Р').prefetch_related(
                'categories', 'products', 'products__photos'), self.request.query_params)

    def perform_destroy(self, instance):
        instance.products.clear()
        instance.categories.clear()
        instance.status = 'ОТ'
        instance.save(update_fields=['status'])


class WorkerOrderViewSet(UpdateModelMixin, viewsets.ReadOnlyModelViewSet):
    serializer_class = serializers.WorkOrderSerializer
    permission_classes = [IsWorkerOrAdmin]

    def get_queryset(self):
        return filter_queryset(
            Order.objects.filter(request__status='Р').prefetch_related(
                'categories', 'products', 'products__photos').select_related('user'), self.request.query_params)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = serializers.CategorySerializer
    permission_classes = [IsWorkerOrAdmin]
