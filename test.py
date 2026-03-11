import requests

BASE_URL = "https://api.jikan.moe/v4"

random_anime_url = "https://api.jikan.moe/v4/random/anime"

top_anime_url = "https://api.jikan.moe/v4/top/anime"

def get_top_anime_name():
    response = requests.get(top_anime_url)
    if response.status_code == 200:
        anime_data = response.json()
        return anime_data["data"]
    else:
        print(f"Failed to retrieve data {response.status_code}")

def get_anime_name(id):
    url = f"{BASE_URL}/anime/{id}/full"
    print(url)
    response = requests.get(url)
    if response.status_code == 200:
        anime_data = response.json()
        return anime_data["data"]
    else:
        print(f"Failed to retrieve data {response.status_code}")

def get_random_name():
    response = requests.get(random_anime_url)
    if response.status_code == 200:
        anime_data = response.json()
        return anime_data
    else:
        print(f"Failed to retrieve data {response.status_code}")

def search_anime(name, limit=None):
    """Search anime by name and return list of results."""
    url = f"{BASE_URL}/anime"
    params = {"q": name, "limit": limit}
    response = requests.get(url, params=params)
    print(response.status_code)
    if response.status_code == 200:
        data = response.json()
        return data["data"]  # returns a list of anime objects
    else:
        print(f"Failed to retrieve data {response.status_code}")
        return []   

def get_people(id):
    url = f"{BASE_URL}/people/{id}/voices"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        return data["data"]
    else:
        print(f"Failed to retrieve data {response.status_code}")
anime_random_info = get_random_name()

if anime_random_info:
    print(f"{anime_random_info["data"]["title"]}")
    print(f"{anime_random_info["data"]["mal_id"]}")

# anime_info = get_anime_name(1)

# if anime_info:
#     print(f"{anime_info["title"]}")

anime_top_info = get_top_anime_name()

# people_info = get_people(50)
# if people_info:
#     for anime in people_info:
#         print(f"Name: {anime["character"]["name"]}")
#         print(f"{anime["anime"]["title"]}")


if anime_top_info:
    for anime in anime_top_info:
        print(f"{anime["title"]}")

# if __name__ == "__main__":
#     query = input("Enter anime name to search: ")
#     results = search_anime(query)
#     print(results)
#     if results:
#         print(f"Found {len(results)} results:\n")
#         for anime in results:
#             print(f"ID: {anime['mal_id']}")
#             print(f"Title: {anime['title']}")
#             print(f"Type: {anime['type']}")
#             print(f"Episodes: {anime['episodes']}")
#             print(f"Score: {anime['score']}")
#             print("-" * 40)
#     else:
#         print("No results found.")