from django.http import JsonResponse
from decouple import config
import requests

from .models import Restaurant, UserFavorite, Feedback
from datetime import datetime

from django.core.exceptions import ObjectDoesNotExist

def search_restaurants(request):
    ''' Yelp Search Business API Call '''

    endpoint = "https://api.yelp.com/v3/businesses/search"
    headers = {"Authorization": "Bearer " + config("YELP_KEY")}
    params = {
        "location": request.POST.get("zipcode"),
        "radius": request.POST.get("radius"),
        "categories": "restaurants",
        # "limit": 6
    }
    res = requests.get(endpoint, headers=headers, params=params)
    if res.status_code == 200:
        return JsonResponse({
            "status": 200,
            "data": res.json()
        })
    else:
        return JsonResponse({
            "status": -1,
            "data": {}
        })

def restaurant_detail(request,id):
    ''' Yelp Business Detail API Call '''

    headers = {"Authorization": "Bearer " + config("YELP_KEY")}
    data = requests.get("https://api.yelp.com/v3/businesses/"+id, headers=headers)
    return JsonResponse(data.json())

def restaurant_reviews(request,id):
    ''' Yelp Business Reviews API Call '''

    headers = {"Authorization": "Bearer " + config("YELP_KEY")}
    data = requests.get("https://api.yelp.com/v3/businesses/"+id+"/reviews", headers=headers)
    return JsonResponse(data.json())

def google_restaurants(request):
    ''' Google Place API call for getting place_id based on place_name '''

    # get place_id based on place_name
    params = {
        "fields": "place_id",
        "input": request.GET.get("q"),
        "inputtype": "textquery",
        "key": config("GOOGLE_MAPS_API")
    }
    candidate = requests.get("https://maps.googleapis.com/maps/api/place/findplacefromtext/json", params=params).json()

    params = {
        "place_id": candidate["candidates"][0]["place_id"],
        "key": config("GOOGLE_MAPS_API")
    }
    data = requests.get("https://maps.googleapis.com/maps/api/place/details/json?fields=rating%2Creview%2Cwebsite", params=params).json()
    data['result']['reviews'] = sorted(data['result']['reviews'], key=lambda x: x['time'], reverse=True)
    return JsonResponse(data)

def get_restaurant(request):
    r_id = request.POST.get("restaurant_id")
    try:
        restaurant = Restaurant.objects.get(restaurant_id=r_id)
    except ObjectDoesNotExist:
        restaurant = Restaurant.objects.create(
            restaurant_id=r_id,
            name=request.POST.get("restaurant_name"),
            address1=request.POST.get("restaurant_address1"),
            address2=request.POST.get("restaurant_address2"),
            image_url=request.POST.get("restaurant_image_url"),
            url="/restaurant/"+r_id
        )
        restaurant.save()
    return restaurant

def user_like(request):
    if request.method == "POST":
        try:

            ### get the POST request data {like,restaurant_id,restaurant_name,restaurant_address}
            is_liked = request.POST.get("like")
            is_liked = eval(is_liked.title())
            restaurant = get_restaurant(request)

            ### get user favorites table
            try:
                ### if can not find, create new entry
                fav = UserFavorite.objects.get(restaurant=restaurant)
                fav.liked = is_liked
                fav.save()
            except ObjectDoesNotExist:
                ### else, update the entry
                fav = UserFavorite.objects.create(
                    user=request.user,
                    restaurant=restaurant,
                    liked=is_liked
                )
                fav.save()
            return JsonResponse({"status":200})

        except:
            return JsonResponse({"status":-1})

def user_review(request):
    if request.method == "POST":
        try:

            ### get restaurant based on id
            stars = int(request.POST.get("stars"))
            restaurant = get_restaurant(request)

            ### save user review
            try:
                review = Feedback.objects.get(user=request.user,restaurant=restaurant)
                review.feedback = request.POST.get("review")
                review.stars = stars
            except ObjectDoesNotExist:
                review = Feedback.objects.create(
                    user=request.user,
                    restaurant=restaurant,
                    feedback=request.POST.get("review"),
                    stars=stars
                )
                review.save()

            ### get user data
            full_name = request.user.first_name + " " + request.user.last_name
            context = {
                "status": 200,
                "fullName": full_name,
                "reviewDate": datetime.now().strftime("%d %b %Y")
            }
            return JsonResponse(context)

        except:
            return JsonResponse({"status":-1})

def edit_user_profile(request):
    if request.method == "POST":
        try:
            ### split the fullname as first and last name
            splits_name = request.POST.get("name","").split(" ")
            if len(splits_name) > 0:
                first_name = splits_name[0]
                last_name = " ".join(splits_name[1:])
            elif len(splits_name) == 1:
                first_name = splits_name[0]
                last_name = ""

            ### change user info
            request.user.first_name = first_name
            request.user.last_name = last_name
            request.user.email = request.POST.get("email")
            request.user.save()
            return JsonResponse({"status":200})
        except:
            return JsonResponse({"status":-1})