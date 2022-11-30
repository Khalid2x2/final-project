from django.urls import path
from . import views
from . import api

urlpatterns = [
    path('', views.index, name='home'),
    path('login/', views.user_login, name='login'),
    path('logout/', views.user_logout, name='logout'),
    path('register/', views.user_register, name='register'),
    path('profile/<str:username>/', views.user_profile, name='user-profile'),

    path('restaurant/<str:id>', views.restaurant_detail, name='restaurant'),
    path('restaurant/yelp/<str:id>', api.restaurant_detail, name='yelp-restaurant'),
    path('restaurant/yelp-reviews/<str:id>', api.restaurant_reviews, name='yelp-reviews'),
    path('restaurants/', views.restaurants, name='restaurants'),
    path('search-restaurants/', api.search_restaurants),

    path('google-restaurants/', api.google_restaurants),

    # path('<int:pk>/feedback/', views.feedback, name="feedback")
]