from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from .models import Instructor, Student

User = get_user_model()

class InstructorSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.username', read_only=True)  # Get name from User model

    class Meta:
        model = Instructor
        fields = ['id', 'name', 'designation', 'university']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'bio', 'is_superuser']

# ------------------------- AUTHENTICATION --------------------------------

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, required=True)  # Explicitly add role

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role', 'bio']

    def create(self, validated_data):
        role = validated_data.pop('role', None)
        user = User.objects.create_user(**validated_data)
        
        # Explicitly set the role
        if role:
            user.role = role
            user.save()  # Save after setting the role

        # Create student/instructor profile
        if role == 'instructor':
            Instructor.objects.create(user=user)
        elif role == 'student':
            Student.objects.create(user=user)

        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = User.objects.filter(username=data['username']).first()
        if user and user.check_password(data['password']):
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token
            access_token['role'] = user.role
            access_token['is_superuser'] = user.is_superuser

            return {
                'refresh': str(refresh),
                'access': str(access_token),
                'user': UserSerializer(user).data
            }
        raise serializers.ValidationError("Invalid credentials")



# ------------------------- TOKEN --------------------------------
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def get_token(self, user):
        token = super().get_token(user)
        print("mmmmm",token)
        token['role'] = user.role  # Add role to the token
        token['is_superuser'] = user.is_superuser  # Add admin status
        print("mmmmm",token)
        return token
    
class CustomTokenRefreshSerializer(TokenRefreshSerializer):
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
    total_users = serializers.IntegerField()
    total_students = serializers.IntegerField()
    total_instructors = serializers.IntegerField()
    total_courses = serializers.IntegerField()
    total_contents = serializers.IntegerField()
    total_quizzes=serializers.IntegerField()
    new_users_last_7_days = UserSerializer(many=True)
    active_users_last_24_hours = UserSerializer(many=True)