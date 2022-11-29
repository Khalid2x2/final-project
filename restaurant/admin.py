from django.contrib import admin

from .models import Restaurant, Feedback, UserFavorite

admin.site.register(Restaurant)
admin.site.register(Feedback)
admin.site.register(UserFavorite)