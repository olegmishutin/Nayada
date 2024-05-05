from rest_framework.permissions import BasePermission
from .models import Order


class IsOwnerAndSafeStatus(BasePermission):
    message = 'Невозможно удалить или отредактировать заказ, если он находится в доставке или вы не являетесь его владельцем'

    def has_object_permission(self, request, view, obj):
        safeMethods = ('GET', 'HEAD', 'OPTIONS', 'POST')

        if request.method in safeMethods:
            return True

        if request.user == obj.user and obj.status != Order.statuses['Д']:
            return True
        return False


class WorkerOrderPermission(BasePermission):
    def has_permission(self, request, view):
        safeMethods = ('GET', 'HEAD', 'OPTIONS', 'PUT', 'PATCH')

        if request.method in safeMethods:
            return True
        return False
