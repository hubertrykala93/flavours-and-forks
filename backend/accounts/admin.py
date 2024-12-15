from django.contrib import admin
from django.contrib.auth.models import Group
from .models import User
from django.contrib.sessions.models import Session
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken

admin.site.unregister(Group)


@admin.register(Session)
class AdminSession(admin.ModelAdmin):
    list_display = [
        "session_key",
        "_session_data",
        "expire_date",
    ]
    list_filter = ["expire_date"]

    def _session_data(self, obj):
        if obj:
            return obj.get_decoded()

    def delete_model(self, request, obj):
        token = OutstandingToken.objects.filter(user=obj).delete()

        super(AdminSession, self).delete_model(request=request, obj=obj)


@admin.register(User)
class AdminUser(admin.ModelAdmin):
    list_display = [
        "id",
        "formatted_date_joined",
        "username",
        "email",
        "is_verified",
        "is_active",
        "is_staff",
        "is_superuser",
    ]
    list_editable = [
        "is_verified",
        "is_active",
        "is_staff",
        "is_superuser",
    ]

    def formatted_date_joined(self, obj):
        if obj.date_joined:
            return obj.date_joined.strftime("%Y-%m-%d %H:%M:%S")

    formatted_date_joined.short_description = "Date Joined"
