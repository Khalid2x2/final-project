from django.http import JsonResponse
from decouple import config
import requests

from .models import Restaurant, UserFavorite, Feedback
from datetime import datetime

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

def user_like(request):
    if request.method == "POST":

        ### get the POST request data {like,restaurant_id,restaurant_name,restaurant_address}
        is_liked = request.POST.get("like")
        is_liked = eval(is_liked.title())
        r_id = request.POST.get("restaurant_id")
        r_name = request.POST.get("restaurant_name")
        r_address = request.POST.get("restaurant_address")
        try:
            restaurant = Restaurant.objects.get(restaurant_id=r_id)
        except:
            restaurant = Restaurant.objects.create(
                restaurant_id=r_id,
                name=r_name,
                address=r_address,
                url="/restaurant/"+r_id
            )
            restaurant.save()

        ### get user favorites table
        try:
            ### if can not find, create new entry
            fav = UserFavorite.objects.get(restaurant=restaurant)
            fav.liked = is_liked
            fav.save()
        except:
            ### else, update the entry
            fav = UserFavorite.objects.create(
                user=request.user,
                restaurant=restaurant,
                liked=is_liked
            )
            fav.save()

        return JsonResponse({"status":200})

# def feedback(request,pk):
#     restaurant = Restaurant.objects.get(id=pk)
#     feedback = request.POST.get("feedback","")
#     stars = request.POST.get("stars",0)
#     new_fb = Feedback.objects.create(
#         feedback=feedback,
#         user=request.user,
#         restaurant=restaurant,
#         stars=stars
#     )
#     new_fb.save()
#     response = {
#         "status": 200,
#         "data": {
#             "username": request.user.username,
#             "feedback": feedback,
#             "date": datetime.now().strftime("%d %b %Y"),
#             "stars": int(stars) if stars != 0 else 0
#         }
#     }
#     return JsonResponse(response)