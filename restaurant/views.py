from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages

from .models import Restaurant

def index(request):
    context = {
        'home_page': True
    }
    return render(request, 'home.html', context)

def restaurants(request):
    if request.method == "GET":
        restaurants = Restaurant.objects.all()
        context = {
            'restaurants_page': True,
            'restaurants': restaurants
        }
        return render(request, 'restaurants.html', context)
    elif request.method == "POST":
        new_restaurant = Restaurant.objects.create(
            name=request.POST.get("restaurant-name"),
            address=request.POST.get("restaurant-address"),
        )
        new_restaurant.save()
        return redirect('restaurants')

def user_profile(request, username):
    return render(request, 'profile.html')

def user_register(request):
    context = {
        'title': 'Registration',
        'registration_page': True
    }
    if request.method == "GET":
        return render(request, 'register.html', context)
    elif request.method == "POST":
        fullname = request.POST.get("name")
        email = request.POST.get("email")
        username = request.POST.get("username")
        password = request.POST.get("password")
        try:
            # check if the username is exist or not
            # return the message if yes, and continue to home page if not
            user = User.objects.get(username=username)
            messages.error(request,"is exists")
            context['username'] = username
            return render(request, 'register.html', context)
        except:
            splited_name = fullname.split(" ")
            if len(fullname) > 1:
                first_name = splited_name[0]
                last_name = " ".join(splited_name[1:])
            else:
                first_name = splited_name[0]
                last_name = ""
            user = User.objects.create(
                username=username,
                password=password,
                first_name=first_name,
                last_name=last_name,
                email=email,
            )
            user.save()
            return redirect("login")

def user_login(request):
    if request.method == "GET":
        context = {
            'title': 'Login',
            'login_page': True
        }
        return render(request, "login.html", context)
    elif request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        try:
            user = User.objects.get(username=username,password=password)
        except User.DoesNotExist:
            user = authenticate(request,username=username,password=password)
        if user:
            login(request, user)
            return redirect("home")
        else:
            return redirect("login")

def user_logout(request):
    logout(request)
    return redirect('login')