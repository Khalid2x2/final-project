from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='home'),
    path('login/', views.user_login, name='login'),
    path('logout/', views.user_logout, name='logout'),
    path('register/', views.user_register, name='register'),
    path('profile/<str:username>/', views.user_profile, name='user-profile'),

    path('restaurants/', views.restaurants, name='restaurants'),
    path('<int:pk>/delete/', views.delete_restaurant, name='delete-restaurant'),
    path('<int:pk>/edit/', views.edit_restaurant, name='edit-restaurant'),

    path('<int:pk>/feedback/', views.feedback, name="feedback")
]