from rest_framework.permissions import BasePermission
from .models import Order


class IsOwnerAndSafeStatus(BasePermission):
    message = 'Статус заказа не позволяет проводить над ним изменения'

    def has_object_permission(self, request, view, obj):
        safeMethods = ('GET', 'HEAD', 'OPTIONS', 'POST')

        if request.method in safeMethods:
            return True

        if request.method == 'DELETE' and request.user == obj.user and obj.status != 'В':
            return True

        if request.user == obj.user and obj.status == 'Н':
            return True
        return False
