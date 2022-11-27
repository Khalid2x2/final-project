from model import db, User, Restaurants, Feedback, connect_to_db

# **************************
# CREATE FUNCTIONS
# **************************


def create_user(first_name, last_name, username, password):
    """Create and return a new user."""

    user = User(first_name=first_name,
                last_name=last_name,
                username=username,
                password=password)

    return user


def create_restaurants(yelp_id, business_name):
    """Create and return a new business."""

    Restaurants = Restaurants(yelp_id=yelp_id,
                        restaurants_name=restaurants_name,)

    return Restaurants


def create_feedback(user_id, restaurant_id, busy_times, comment):
    """Create and return a new Restaurants."""

    feedback = Feedback(user_id=user_id,
                        business_id=business_id,
                        chair_parking=chair_parking,
                        ramp=ramp,
                        auto_door=auto_door,
                        comment=comment)

    return feedback
