from django.urls import path
from .views import RegisterView,LoginView,GetUserView,RegisterVoteView,Vote, VoteListView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/",LoginView.as_view(),name="login"),
    path("users/<int:id>/",GetUserView.as_view(),name="get-user"),
    path('vote/',RegisterVoteView.as_view(),name="register-vote"),
    path('get-votes/',VoteListView.as_view(),name="get-votes")
]