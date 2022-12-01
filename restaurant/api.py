from django.http import JsonResponse
from decouple import config
import requests

from .models import Restaurant, Feedback
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