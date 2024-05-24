from rest_framework.permissions import BasePermission


# Класс-разрешение для проверки того, что пользователь является администратором или работником
class IsWorkerOrAdmin(BasePermission):
    message = 'Доступ запрещен, так как вы не явлетесь сотрудником'

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_worker or request.user.is_staff
