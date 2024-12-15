from django.urls import path
from . import views as accounts_views

urlpatterns = [
    path(route="api/v1/register", view=accounts_views.RegisterAPIView.as_view(), name="api-register"),
    path(route="api/v1/login", view=accounts_views.LoginAPIView.as_view(), name="api-login"),
    path(route="api/v1/logout", view=accounts_views.LogoutAPIView.as_view(), name="api-logout"),
]
