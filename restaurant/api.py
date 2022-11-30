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