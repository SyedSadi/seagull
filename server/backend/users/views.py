from rest_framework.response import Response
from rest_framework import status, generics, permissions, viewsets
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, LoginSerializer, InstructorSerializer, UserSerializer
from .models import Instructor
from rest_framework.views import APIView
from django.utils.timezone import now, timedelta
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.exceptions import AuthenticationFailed
from django.core.exceptions import ObjectDoesNotExist
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .serializers import CustomTokenObtainPairSerializer, CustomTokenRefreshSerializer, DashboardStatsSerializer
from users.models import User
from courses.models import Course, CourseContents 

# -------------------- AUTHENTICATION ---------------------------------
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate JWT tokens after registration
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        return Response({
            "user": serializer.data,
            "refresh": str(refresh),
            "access": access_token
        }, status=status.HTTP_201_CREATED)

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)

class LogoutView(APIView):
    permission_classes = [AllowAny]  # Allow logout without requiring access token

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh_token)
            token.blacklist()  # Blacklist the token

            return Response({"message": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)



# -------------------- TOKEN ---------------------------------
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class CustomTokenRefreshView(TokenRefreshView):
    serializer_class = CustomTokenRefreshSerializer



# -------------------- ADMIN PANEL ---------------------------------
class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    def get(self, request, *args, **kwargs):
        new_users_last_7_days = User.objects.filter(date_joined__gte=now() - timedelta(days=7))
        active_users_last_24_hours = User.objects.filter(last_login__gte=now() - timedelta(days=1))
        stats = {
            "total_users": User.objects.count(),
            "total_students": User.objects.filter(role='student').count(),
            "total_instructors": User.objects.filter(role='instructor').count(),
            "total_courses": Course.objects.count(),
            "total_contents": CourseContents.objects.count(),
            "new_users_last_7_days": UserSerializer(new_users_last_7_days, many=True).data,
            "active_users_last_24_hours": UserSerializer(active_users_last_24_hours, many=True).data,
        }

        serializer = DashboardStatsSerializer(stats)
        return Response(serializer.data)


class InstructorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Instructor.objects.all()
    serializer_class = InstructorSerializer
