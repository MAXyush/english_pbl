# accounts/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from .models import Vote



class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    confirmPassword = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ("id", "username", "email", "password", "confirmPassword")
        
    def validate_email(self, value):
        if not value.endswith("@srmist.edu.in"):
            raise serializers.ValidationError("Email must be an @srmist.edu.in email.")
        return value

    def validate(self, data):
        # Check if passwords match
        if data["password"] != data["confirmPassword"]:
            raise serializers.ValidationError({"confirmPassword": "Passwords do not match."})

        # Check if email already exists
        if User.objects.filter(email=data["email"]).exists():
            raise serializers.ValidationError({"email": "Email is already taken."})

        return data

    def create(self, data):
        # Remove confirmPassword before creating the user
        data.pop("confirmPassword")
        user = User.objects.create_user(
            username=data["username"],
            email=data["email"],
            password=data["password"],
        )
        return user
    
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            raise serializers.ValidationError("Both username and password are required.")

        # Authenticate user
        user = authenticate(username=username, password=password)

        if not user:
            raise serializers.ValidationError("Invalid username or password.")

        data["user"] = user
        return data

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id","username","email"]
        

from .models import Vote

class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ['user', 'book', 'created_at']
