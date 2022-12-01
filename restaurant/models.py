from django.db import models
from django.contrib.auth.models import User

class Restaurant(models.Model):
    restaurant_id = models.CharField(max_length=256,unique=True,blank=True,null=True)
    name = models.CharField(max_length=256)
    address1 = models.CharField(max_length=600,default="")
    address2 = models.CharField(max_length=600,default="")
    url = models.CharField(max_length=788,default="#")
    image_url = models.CharField(max_length=1200,default="#")

    def __str__(self) -> str:
        return self.name

class Feedback(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.RESTRICT)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    feedback = models.TextField(default="")
    stars = models.IntegerField(default=0)

    def __str__(self):
        user_fullname = self.user.first_name + " " + self.user.last_name
        return f'{user_fullname} review on {self.restaurant.name}: "{self.feedback.strip()}"'

class UserFavorite(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    liked = models.BooleanField(default=False)

    def __str__(self):
        title = [
            self.user.username,
            self.restaurant.name
        ]
        return " ".join(title)