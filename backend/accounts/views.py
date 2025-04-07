# accounts/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, VoteSerializer, VotingStatusSerializer
from django.contrib.auth import login
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from .models import Vote, VotingStatus
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.db.models import Count
from rest_framework.exceptions import PermissionDenied

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User created successfully!"}, 
                status=status.HTTP_201_CREATED
            )
        
        return Response(
            {"errors": serializer.errors, "message": "User creation failed. Please check your input."},
            status=status.HTTP_400_BAD_REQUEST,
        )

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            login(request, user)
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            return Response(
                {
                    "message": "Login successful!",
                    "token": access_token,
                    "refresh_token": str(refresh),
                    "is_admin": user.is_staff,
                },
                status=status.HTTP_200_OK,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class GetUserView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, id):
        try:
            user = User.objects.get(id=id)
            serializer = UserSerializer(user)
            return Response(serializer.data, status=200)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        
class RegisterVoteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Check if voting is active
        voting_status = VotingStatus.objects.first()
        if not voting_status or not voting_status.is_active:
            return Response(
                {"message": "Voting is currently closed."},
                status=status.HTTP_403_FORBIDDEN
            )

        book = request.data.get("book")
        user_id = request.data.get("id")
        
        if not book:
            return Response(
                {"message": "Book title is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"message": "User not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check if the user has already voted
        if Vote.objects.filter(user=user).exists():
            return Response(
                {"message": "You have already voted."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create the vote
        vote = Vote.objects.create(user=user, book=book)
        serializer = VoteSerializer(vote)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class VoteListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get vote counts for each book
        vote_counts = Vote.objects.values('book').annotate(count=Count('id'))
        
        # Get all votes with user details
        votes = Vote.objects.select_related('user').all()
        serializer = VoteSerializer(votes, many=True)
        
        return Response({
            'votes': serializer.data,
            'vote_counts': vote_counts
        }, status=status.HTTP_200_OK)

class VotingStatusView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        return [IsAdminUser()]

    def get(self, request):
        status = VotingStatus.objects.first()
        if not status:
            status = VotingStatus.objects.create()
        serializer = VotingStatusSerializer(status)
        return Response(serializer.data)

    def post(self, request):
        status = VotingStatus.objects.first()
        if not status:
            status = VotingStatus.objects.create()
        
        # Update is_active if provided
        if 'is_active' in request.data:
            status.is_active = request.data['is_active']
        
        # Update display_results if provided
        if 'display_results' in request.data:
            status.display_results = request.data['display_results']
        
        status.save()
        serializer = VotingStatusSerializer(status)
        return Response(serializer.data)
        