import requests

def search_and_fetch_videos(query, max_results=5):
    api_key = 'AIzaSyCbeKMHyKxU7r7t6R1cVBcU3wcnPWp-Ijc'
    base_url = 'https://www.googleapis.com/youtube/v3/search'
    params = {
        'key': api_key,
        'part': 'snippet',
        'type': 'video',
        'q': query,
        'maxResults': max_results
    }

    try:
        response = requests.get(base_url, params=params)
        response.raise_for_status()  # Raise an exception for 4xx or 5xx status codes
        data = response.json()

        if 'items' in data:
            video_details = []
            for item in data['items']:
                video_id = item['id']['videoId']
                title = item['snippet']['title']
                description = item['snippet']['description']
                thumbnail = item['snippet']['thumbnails']['default']['url']
                video_details.append({'video_id': video_id, 'title': title, 'description': description, 'thumbnail': thumbnail})
            return video_details
        else:
            print('No items found in response:', data)
            return []
    except requests.exceptions.RequestException as e:
        print('Error fetching data from YouTube API:', e)
        return []