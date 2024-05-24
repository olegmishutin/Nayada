from rest_framework.renderers import TemplateHTMLRenderer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


# Представление для обработки статического билда клиента на django (react build)
class IndexView(APIView):
    renderer_classes = [TemplateHTMLRenderer]  # Установка классов-рендеров для отображения макета

    # Обработка GET запроса
    def get(self, request, path=None):
        return Response({}, template_name='index.html')


# Конечные url-точки
urlpatterns = [
    path('', IndexView.as_view()),  # URL путь к представлению для обработки статического билда клиента
    path('api/', include('user.urls')),  # Подключени конечных точек из других приложений
    path('api/', include('product.urls')),  # Подключени конечных точек из других приложений
    path('api/', include('order.urls')),  # Подключени конечных точек из других приложений
    path('', include(static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT))),  # Подключение медиа файлов
    path('<path:path>', IndexView.as_view())  # URL путь для обработки react-router
]
