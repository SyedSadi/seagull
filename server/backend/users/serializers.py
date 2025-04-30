from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator
from .models import Instructor, Student

# Get the custom User model
User = get_user_model()

# ------------------------- PROFILE SERIALIZERS -------------------------

class InstructorSerializer(serializers.ModelSerializer):
    """
    Serializer for the Instructor model.
    Includes a read-only field 'name' from the related User model.
    """
    name = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True) 
    bio = serializers.CharField(source='user.bio', read_only=True)  

    class Meta:
        model = Instructor
        fields = ['id', 'name', 'designation', 'university', 'email', 'bio']

class StudentSerializer(serializers.ModelSerializer):
    """
    Serializer for the Student model.
    Currently only includes the 'id' field.
    """
    class Meta:
        model = Student
        fields = ['id']

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the custom User model.
    Nested serializers for student and instructor data.
    """
    instructor = InstructorSerializer(required=False)
    student = StudentSerializer(required=False)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'bio', 'is_superuser', 'instructor', 'student']

# ------------------------- AUTHENTICATION SERIALIZERS -------------------------

class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for registering new users and creating related profiles."""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    email = serializers.EmailField(validators=[UniqueValidator(queryset=User.objects.all())])
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role', 'bio']

    def create(self, validated_data):
        role = validated_data.pop('role')
        user = User.objects.create_user(**validated_data)
        user.role = role
        user.save()

        profile_model = Instructor if role == 'instructor' else Student
        profile_model.objects.create(user=user)

        return user

class LoginSerializer(serializers.Serializer):
    """Serializer for authenticating users and returning JWT tokens with custom claims."""
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = User.objects.filter(username=data['username']).first()

        if not user:
            raise serializers.ValidationError("No user found with this username. Please register first.")
        if not user.is_active:
            raise serializers.ValidationError("Please verify your email before logging in.")
        if not user.check_password(data['password']):
            raise serializers.ValidationError("Incorrect password. Please try again.")

        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        access_token['role'] = user.role
        access_token['is_superuser'] = user.is_superuser

        return {
            'refresh': str(refresh),
            'access': str(access_token),
            'user': UserSerializer(user).data
        }


# ------------------------- CUSTOM JWT TOKEN SERIALIZERS -------------------------
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    
    def validate(self, attrs):
        user = User.objects.filter(username=attrs.get("username")).first()        

        if not user:
            raise serializers.ValidationError("No user found with this username. Please register first.")
        
        if not user.is_active:
            raise serializers.ValidationError("Please verify your email before logging in.")
        
        data = super().validate(attrs)

        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'username': self.user.username
        }
        return data
    
    def get_token(self, user):
        token = super().get_token(user)
        token['role'] = user.role  # Add role to the token
        token['is_superuser'] = user.is_superuser  # Add admin status
        return token
    
class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    """
    Custom serializer to extend token payload with additional user information during login.
    """
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Decode the refresh token to get the user
        refresh = RefreshToken(attrs['refresh'])
        user = User.objects.get(id=refresh.payload['user_id'])

        # Add custom claims to the new access token
        access_token = refresh.access_token
        access_token['role'] = user.role
        access_token['is_superuser'] = user.is_superuser

        # Return modified token data
        data['access'] = str(access_token)
        return data
    

# ------------------------- ADMIN --------------------------------
class DashboardStatsSerializer(serializers.Serializer):
    """
    Serializer for returning admin dashboard statistics.
    Includes total counts and recent user activity.
    """
    total_users = serializers.IntegerField()
    total_students = serializers.IntegerField()
    total_instructors = serializers.IntegerField()
    total_courses = serializers.IntegerField()
    total_contents = serializers.IntegerField()
    total_quizzes = serializers.IntegerField()
    new_users_last_7_days = UserSerializer(many=True, read_only=True)
    active_users_last_24_hours = UserSerializer(many=True, read_only=True)



# ------------------------- LANDING PAGE STATS --------------------------------
class LandingPageStatsSerializer(serializers.Serializer):
    """
    Serializer for returning statistics on the landing page.
    Used to show platform scale and user engagement.
    """
    total_students = serializers.IntegerField()
    total_instructors = serializers.IntegerField()
    total_courses = serializers.IntegerField()
    total_quizzes=serializers.IntegerField()