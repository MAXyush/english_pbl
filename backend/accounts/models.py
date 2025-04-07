from django.db import models
from django.contrib.auth.models import User

class Vote(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.CharField(max_length=255, default="None")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} voted for {self.book}"

class VotingStatus(models.Model):
    is_active = models.BooleanField(default=True)
    display_results = models.BooleanField(default=False)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        status = 'active' if self.is_active else 'inactive'
        display = 'results shown' if self.display_results else 'results hidden'
        return f"Voting is {status}, {display}"
