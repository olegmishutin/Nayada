from rest_framework import viewsets
from rest_framework.mixins import UpdateModelMixin
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Order, Category, OrderRequest
from . import serializers
from .permissions import IsOwnerAndSafeStatus
from product.permissions import IsWorkerOrAdmin


# Метод для фильтра заказов, который в дальнейшем буду использовать представления
def filter_queryset(queryset, params):
    retQueryset = queryset  # Набор данных, которые нужно отфильтровать
    status = params.get('status')  # Получения статусов заказов из параметров запроса
    filtersCheckboxex = {'expensive': '-price', 'cheap': 'price'}  # Словарь фильров по цене

    categories = Category.objects.all()
    categoriesForFilter = [category for category in categories if
                           params.get(f'category-{category.id}')]  # Категории по которым нужно фильтровать данные

    if categoriesForFilter:
        retQueryset = queryset.filter(categories__in=categoriesForFilter)  # Фильтрация по категориям

    if status:
        statuses = status.split(',')
        retQueryset = retQueryset.filter(status__in=statuses)  # Филтрация по статусам

    filter = [value for key, value in filtersCheckboxex.items() if params.get(key)]  # Отмеченные фильтры по цене
    return retQueryset.order_by(*filter, '-creation_time').distinct('price', 'creation_time', 'identification_number')


# Представление для просмотра пользователем его запросов
class UserOrderRequestViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = serializers.UserOrderRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return OrderRequest.objects.filter(
            order__user=self.request.user).select_related(
            'order').prefetch_related('order__user', 'order__products', 'order__categories', 'order__products__photos')


# Представление для просмотра и изменения запросов пользователей
class WorkerOrderRequestViewSet(UpdateModelMixin, UserOrderRequestViewSet):
    serializer_class = serializers.WorkerOrderRequestSerializer
    permission_classes = [IsWorkerOrAdmin]

    def get_queryset(self):
        return OrderRequest.objects.exclude(status__in=['Р', 'ОТ']).select_related(
            'order').prefetch_related('order__user', 'order__products', 'order__categories', 'order__products__photos')


# Представление для манипулирования пользователем его заказами
class UserOrderViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.UserOrderSerializer
    permission_classes = [IsAuthenticated, IsOwnerAndSafeStatus]

    def get_queryset(self):
        return filter_queryset(
            self.request.user.orders.filter(request__status='Р').prefetch_related(
                'categories', 'products', 'products__photos'), self.request.query_params)

    # Переписывем метод, который срабатывает при DELETE запросе, чтобы не удалять заказ, а устанавливать статус как отменен
    def perform_destroy(self, instance):
        instance.status = 'ОТ'
        instance.save(update_fields=['status'])


# Представление для просмотра и изменения заказов пользователей
class WorkerOrderViewSet(UpdateModelMixin, viewsets.ReadOnlyModelViewSet):
    serializer_class = serializers.WorkOrderSerializer
    permission_classes = [IsWorkerOrAdmin]

    def get_queryset(self):
        return filter_queryset(
            Order.objects.filter(request__status='Р').prefetch_related(
                'categories', 'products', 'products__photos').select_related('user'), self.request.query_params)


# Представление для манипулирования категориями
class AdminCategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by('-id')
    serializer_class = serializers.CategorySerializer
    permission_classes = [IsAdminUser]


# Представление для просмотра категорий обычным пользователем
class UserCatgoryListView(ListAPIView):
    queryset = Category.objects.all().order_by('-id')
    serializer_class = serializers.CategorySerializer
    permission_classes = [IsAuthenticated]
