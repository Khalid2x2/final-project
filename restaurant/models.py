from django.db import models
from django.contrib.auth.models import User

class Restaurant(models.Model):
    name = models.CharField(max_length=256)
    address = models.CharField(max_length=600)
    url = models.CharField(max_length=788,unique=True)

    def __str__(self) -> str:
        return self.name

class Feedback(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.RESTRICT)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    feedback = models.TextField(default="")
    stars = models.IntegerField(default=0)

    def __str__(self):
        return self.feedback

class UserFavorite(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)

    def __str__(self):
        title = [
            self.user.username,
            self.restaurant.name
        ]
        return " ".join(title)