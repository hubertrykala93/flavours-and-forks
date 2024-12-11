from django.urls import path
from . import views as accounts_views

urlpatterns = [
    path(route="api/v1/register", view=accounts_views.RegisterAPIView.as_view(), name="api-register"),
]
