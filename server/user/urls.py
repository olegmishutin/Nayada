from django.urls import path, include
from rest_framework.routers import SimpleRouter
from . import views

router = SimpleRouter()
router.register('users', views.UsersViewSet, basename='users')

app_name = 'user'
urlpatterns = [
    path('register/', views.RegisterUserView.as_view(), name='register'),
    path('login/', views.LoginUserView.as_view(), name='login'),
    path('logout/', views.LogoutUserView.as_view(), name='logout'),
    path('me/', views.ProfileView.as_view(), name='profile'),
    path('', include(router.urls))
]
