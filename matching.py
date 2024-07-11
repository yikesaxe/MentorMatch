import sqlite3
import json
import requests
import math
import sys

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

def fetch_profiles():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM user')
    profiles = cursor.fetchall()
    conn.close()

    profiles_list = [dict(profile) for profile in profiles]
    for profile in profiles_list:
        profile['skills'] = json.loads(profile['skills'])
        profile['interests'] = json.loads(profile['interests'])
        profile['goals'] = json.loads(profile['goals'])

    return profiles_list

def get_lat_lng(city, api_key):
    base_url = "https://geocode.maps.co/search"
    params = {
        "q": city,
        "api_key": api_key
    }
    response = requests.get(base_url, params=params)
    results = response.json()
    if results:
        location = results[0]
        return float(location['lat']), float(location['lon'])
    else:
        return None, None

def haversine(lat1, lng1, lat2, lng2):
    R = 6371  # Earth radius in kilometers
    d_lat = math.radians(lat2 - lat1)
    d_lng = math.radians(lat2 - lng1)
    a = (math.sin(d_lat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(d_lng / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = R * c
    return distance

def compute_similarity(mentor, mentee, api_key):
    # Compute skill similarity using Jaccard similarity coefficient
    mentor_skills = set(mentor['skills'])
    mentee_skills = set(mentee['skills'])
    intersection = len(mentor_skills & mentee_skills)
    union = len(mentor_skills | mentee_skills)
    skill_similarity = intersection / union if union != 0 else 0

    # Compute interests similarity using Jaccard similarity coefficient
    mentor_interests = set(mentor['interests'])
    mentee_interests = set(mentee['interests'])
    intersection = len(mentor_interests & mentee_interests)
    union = len(mentor_interests | mentee_interests)
    interest_similarity = intersection / union if union != 0 else 0

    # Compute goals similarity using Jaccard similarity coefficient
    mentor_goals = set(mentor['goals'])
    mentee_goals = set(mentee['goals'])
    intersection = len(mentor_goals & mentee_goals)
    union = len(mentor_goals | mentee_goals)
    goal_similarity = intersection / union if union != 0 else 0

    # Compute location proximity
    mentor_lat, mentor_lng = get_lat_lng(mentor['location'], api_key)
    mentee_lat, mentee_lng = get_lat_lng(mentee['location'], api_key)
    distance = haversine(mentor_lat, mentor_lng, mentee_lat, mentee_lng)
    max_distance = 10000  # Adjust based on your expected max distance
    proximity_similarity = max(0, (max_distance - distance) / max_distance)

    # Weighted sum of similarities
    total_similarity = (0.2 * skill_similarity + 
                        0.2 * interest_similarity + 
                        0.1 * goal_similarity +
                        0.5 * proximity_similarity)

    return total_similarity

def rank_mentors_for_mentees(profiles, api_key):
    mentors = [profile for profile in profiles if profile['userType'] == 'mentor']
    mentees = [profile for profile in profiles if profile['userType'] == 'mentee']

    ranked_matches = []
    for mentee in mentees:
        mentor_scores = []
        for mentor in mentors:
            score = compute_similarity(mentor, mentee, api_key)
            mentor_scores.append((mentor, score))
        mentor_scores.sort(key=lambda x: x[1], reverse=True)
        ranked_matches.append({'mentee': mentee, 'mentors': mentor_scores[:3]})

    return ranked_matches

if __name__ == '__main__':
    api_key = "668ffc84c608d925087664kah759c46"

    import sys
    import json

    if len(sys.argv) < 2:
        print("Usage: python matching.py <json_file>")
        sys.exit(1)

    try:
        with open(sys.argv[1], 'r') as file:
            profiles = json.load(file)
            print("Parsed JSON successfully!")
    except Exception as e:
        print("Error decoding JSON:", e)
    
    ranked_matches = rank_mentors_for_mentees(profiles, api_key)
    print(json.dumps(ranked_matches, indent=4))
