# accounts/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer,LoginSerializer, UserSerializer , VoteSerializer
from django.contrib.auth import login
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from .models import Vote
from rest_framework.permissions import IsAuthenticated


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User created successfully!"}, 
                status=status.HTTP_201_CREATED
            )
        
        # Return detailed errors if serializer is not valid
        return Response(
            {"errors": serializer.errors, "message": "User creation failed. Please check your input."},
            status=status.HTTP_400_BAD_REQUEST,
        )

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]

            # Login the user
            login(request, user)

            #long-lived tokens used to generated access_token
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            # ✅ Return token with success message
            return Response(
                {
                    "message": "Login successful!",
                    "token": access_token,
                    "refresh_token": str(refresh),
                },
                status=status.HTTP_200_OK,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class GetUserView(APIView):
    def get(self,request,id):
        user = User.objects.get(id=id)
        if user is not None:
            serializer = UserSerializer(user)
            return Response(serializer.data,status=200)
        else :
            return Response({"Error":"User not found"},status=404)
        
class RegisterVoteView(APIView):  # Ensure user is authenticated

    def post(self, request):
        # Ensure the user is authenticated
        
        # Get the book title from the request
        book = request.data.get("book")
        user_id = request.data.get("id")
        user = User.objects.get(id =user_id)
        # Check if the user has already voted
        if Vote.objects.filter(user=user).exists():
            return Response({"message": "User has already voted."})

        # Create the vote for the user
        vote = Vote.objects.create(user=user, book=book)

        # Serialize the vote object
        serializer = VoteSerializer(vote)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
# accounts/views.py
class VoteListView(APIView):
    def get(self, request):
        book = request.query_params.get('book')
        
        get_books =  Vote.objects.filter(book=book).count()# Get 'book' from query parameters
        if book:
            # Filter votes by the book title
            votes = Vote.objects.filter(book=book)
        else:
            # If no book title is provided, return all votes
            votes = Vote.objects.all()
        
        serializer = VoteSerializer(votes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

        