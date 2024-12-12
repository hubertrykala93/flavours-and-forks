from rest_framework import serializers
from accounts.models import User
from django.core.validators import RegexValidator


class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        min_length=3,
        max_length=20,
        required=True,
        trim_whitespace=True,
        error_messages={
            "invalid": "Username is required.",
            "min_length": "Username must be at least 3 characters long.",
            "max_length": "Username cannot exceed 20 characters long",
        },
    )
    email = serializers.CharField(
        min_length=5,
        max_length=255,
        required=True,
        trim_whitespace=True,
        validators=[
            RegexValidator(
                regex=r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
                message="Email address format is invalid.",
            )
        ],
        error_messages={
            "invalid": "Email is required.",
            "min_length": "Email must be at least 5 characters long.",
            "max_length": "Email cannot exceed 255 characters long.",
        },
    )
    password = serializers.CharField(
        min_length=5,
        max_length=255,
        required=True,
        write_only=True,
        trim_whitespace=True,
        validators=[
            RegexValidator(
                regex=r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$',
                message="Password must have at least one uppercase letter, one lowercase letter, a number, and a special character (@, $, !, %, ?, &).",
            ),
        ],
        error_messages={
            "required": "Password is required",
            "min_length": "Password must be at least 5 characters long.",
            "max_length": "Password cannot exceed 255 characters long.",
        },
    )
    repassword = serializers.CharField(
        required=True,
        trim_whitespace=True,
        write_only=True,
        error_messages={
            "required": "Confirm Password is required.",
        },
    )

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "repassword",
        ]

    def validate_username(self, username):
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError(
                detail="A user with this account name already exists, please choose another one."
            )

        return username

    def validate_email(self, email):
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError(
                detail="A user with this email address already exists, please provide another one.",
            )

        return email

    def validate_repassword(self, repassword):
        password = self.initial_data.get("password")

        if repassword != password:
            raise serializers.ValidationError("The passwords do not match. Please ensure both fields are identical.")

        return repassword

    def create(self, validated_data):
        user = User(
            username=validated_data.get("username"),
            email=validated_data.get("email"),
        )
        user.set_password(validated_data.get("password"))
        user.save()

        return user
