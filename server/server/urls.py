from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# Конечные url-точки
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('user.urls')),  # Подключени конечных точек из других приложений
    path('api/', include('product.urls')),  # Подключени конечных точек из других приложений
    path('api/', include('order.urls')),  # Подключени конечных точек из других приложений
    path('', include(static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)))  # Подключение url для медиа файлов
]
