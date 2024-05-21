from django.urls import path, include
from rest_framework.routers import SimpleRouter
from . import views

router = SimpleRouter()
router.register('user-orders', views.UserOrderViewSet, basename='user-orders')
router.register('user-requests', views.UserOrderRequestViewSet, basename='user-requests')
router.register('worker-orders', views.WorkerOrderViewSet, basename='worker-orders')
router.register('worker-requests', views.WorkerOrderRequestViewSet, basename='worker-requests')
router.register('categories', views.AdminCategoryViewSet, basename='categories')

app_name = 'order'
urlpatterns = [
    path('user-categories/', views.UserCatgoryListView.as_view(), name='user-categories'),
    path('', include(router.urls))
]
