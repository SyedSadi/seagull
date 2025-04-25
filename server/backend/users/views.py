from rest_framework.response import Response
from rest_framework import status, generics, permissions, viewsets
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, LoginSerializer, InstructorSerializer, UserSerializer
from .models import Instructor
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_encode
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.utils.encoding import force_str, DjangoUnicodeDecodeError
from django.contrib.auth.tokens import default_token_generator
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from rest_framework import status
from rest_framework.permissions import AllowAny
from decouple import config
from django.contrib.auth.tokens import default_token_generator
from django.utils import timezone
from datetime import timedelta
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .serializers import CustomTokenObtainPairSerializer, CustomTokenRefreshSerializer, DashboardStatsSerializer, LandingPageStatsSerializer
from .services import DashboardStatsService, LandingPageStatsService

User = get_user_model()
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
        user.is_active = False  # mark user as inactive until email is verified
        user.save()

        # Create custom expiration time for the token (e.g., 24 hours)
        _ = timezone.now() + timedelta(days=1)  # 24 hours from now

        # Generate email verification token
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        domain = config('FRONTEND_DOMAIN')
        verification_link = f"{domain}/verify-email/{uid}/{token}/" 

        # Render the HTML template
        html_message = render_to_string("users/verify_email.html", {
            'user': user,
            'verification_link': verification_link,
        })

        # Create plain text fallback
        plain_message = strip_tags(html_message)

        subject = "Confirm Your Email to Get Started with KUETx"
        from_email = config('EMAIL_HOST_USER')
        to_email = user.email

        # Send the email
        send_mail(subject, plain_message, from_email, [to_email], html_message=html_message)

        return Response({
            "message": "Registration successful. Please check your email to verify your account."
        }, status=status.HTTP_201_CREATED)

# -------------- VERIFY EMAIL ----------------------------
class VerifyEmailAPIView(APIView):
    permission_classes = [AllowAny]
    def get(self, _, uidb64, token):
        try:
            # Decode the UID from base64
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist, DjangoUnicodeDecodeError):
            return Response({'error': 'Invalid or expired link'}, status=status.HTTP_400_BAD_REQUEST)

        if default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()

            #Generate JWT tokens now
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            return Response({
                "message": "Email verified successfully.",
                "refresh": str(refresh),
                "access": access_token,
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "username": user.username
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_400_BAD_REQUEST)
        

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
        except Exception as _:
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
        try:
            stats_data = DashboardStatsService.get_dashboard_stats()
            serializer = DashboardStatsSerializer(stats_data)
            return Response(
                {
                    "success": True,
                    "message": "Dashboard stats fetched successfully.",
                    "data": serializer.data
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {
                    "success": False,
                    "message": "Failed to fetch dashboard stats.",
                    "error": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# -------------------- LANDING PAGE STATS ---------------------------------
class LandingPageStatsView(APIView):
    permission_classes=[AllowAny]

    def get(self, _request, *_args, **_kwargs):
        try:
            stats_data=LandingPageStatsService.get_landingpage_stats()
            serializer=LandingPageStatsSerializer(stats_data)
            return Response(
                {
                    "success":True,
                    "message": "Landing page stats fetched successfully",
                    "data": serializer.data
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {
                    "success": False,
                    "message": "Failed to fetch landing page stats",
                    "error":str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# ------------------------------- USERS -----------------------------------------
class InstructorViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [AllowAny]
    queryset = Instructor.objects.all()
    serializer_class = InstructorSerializer


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        data = request.data

        user.bio = data.get('bio', user.bio)
        user.save()
        if user.role == 'instructor':
            instructor, _ = Instructor.objects.get_or_create(user=user)
            instructor_data = data.get('instructor', {})
            instructor.designation = instructor_data.get('designation', instructor.designation)
            instructor.university = instructor_data.get('university', instructor.university)
            instructor.save()

        return Response(UserSerializer(user).data)