from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import messages

from .models import Restaurant, UserFavorite, Feedback
from django.core.exceptions import ObjectDoesNotExist

@login_required()
def index(request):
    context = {
        'home_page': True
    }
    return render(request, 'home.html', context)

# Restaurants Views
@login_required()
def restaurants(request):
    context = {
        "title": "Restaurants Page"
    }
    return render(request, 'restaurants.html', context)

@login_required()
def restaurant_detail(request,id):

    def span_stars(rating):
        spans = []
        for i in range(1,6):
            if i <= rating:
                spans.append('<span><i class="fa-solid fa-star"></i></span>')
            else:
                spans.append('<span><i class="fa-regular fa-star"></i></span>')
        spans = "\n".join(spans)
        return spans

    fullname = request.user.first_name + " " + request.user.last_name
    context = {
        "restaurant_id": id,
        "user_fullname": fullname.strip()
    }

    ### get user liked
    try:
        fav = UserFavorite.objects.get(
            user=request.user,
            restaurant=Restaurant.objects.get(restaurant_id=id),
        )
        context["user_like_it"] = fav.liked
    except ObjectDoesNotExist:
        context["user_like_it"] = False

    ### get user review
    try:
        review = Feedback.objects.get(
            user=request.user,
            restaurant=Restaurant.objects.get(restaurant_id=id),
        )
        context["user_review"] = review
        context["stars"] = span_stars(review.stars)
    except ObjectDoesNotExist:
        context["user_review"] = None

    return render(request, "restaurant_detail_view.html", context)

# User views
def user_profile(request, username):
    def fn_as_sn(name):
        ''' fullname as first and last name '''
        if name:
            names = name.split(" ")
            if len(names) == 0:
                return "", ""
            elif len(names) == 1:
                return names[0], ""
            else:
                return names[0], " ".join(names[1:])
        else:
            return "", ""

    if request.method == "POST":

        ### edit user information
        fullname = request.POST.get("user-fullname")
        username = request.POST.get("user-name")
        email = request.POST.get("user-email")
        first_name, last_name = fn_as_sn(fullname)
        request.user.first_name = first_name
        request.user.last_name = last_name
        request.user.username = username
        request.user.email = email
        request.user.save()

    ### get user favorite places and reviews history
    context = {
        "likes": UserFavorite.objects.filter(user=request.user),
        "reviews": Feedback.objects.filter(user=request.user),
        "stars": range(1,6),
    }

    return render(request, 'profile.html', context)

def user_register(request):
    context = {
        'title': 'Registration',
        'registration_page': True
    }
    if request.method == "POST":
        fullname = request.POST.get("name")
        email = request.POST.get("email")
        username = request.POST.get("username")
        password = request.POST.get("password")
        try:
            # check if the username is exist or not
            # return the message if yes, and continue to home page if not
            user = User.objects.get(username=username)
            context['username'] = username
            context['error_message'] = "username @" + username + " is exists!"
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
    return render(request, 'register.html', context)

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
            context = {
                "error_message": "The username or password incorrect!"
            }
            return render(request, "login.html", context)

def user_logout(request):
    logout(request)
    return redirect('login')