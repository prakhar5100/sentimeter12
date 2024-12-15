import sys
import json
import pandas as pd
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from collections import Counter
import requests
from bs4 import BeautifulSoup
from groq import Groq

# Ensure required nltk data is downloaded
nltk.download('vader_lexicon')
nltk.download('punkt')
nltk.download('stopwords')

client = Groq(api_key="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")

def scrape_reviews(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-us,en;q=0.5'
    }

    reviews_data = []
    image = ""
    product_title = ""
    
    for i in range(1, 4):

        try:
            url = url + "&page=" + str(i)
            page = requests.get(url, headers=headers)
            soup = BeautifulSoup(page.content, 'html.parser')
            
            title_elem = soup.find('a', class_='wjcEIp AbG6iz')
            product_title = title_elem['title'] if title_elem else "Product Title Not Found"
            
            image_elem = soup.find('img', class_='DByuf4')
            image = image_elem['src'] if image_elem else ""
            
            reviews = soup.find_all('div', class_='ZmyHeo')
            locations = soup.find_all('p', class_='MztJPv')
            
            for review, location in zip(reviews, locations):
                reviews_data.append({
                    'text': review.get_text().strip(),
                    'location': location.get_text().strip()
                })
                
        except Exception as e:
            print(f"Error scraping reviews: {str(e)}")
        
    return reviews_data, image, product_title


def analyze_sentiment(reviews):
    sia = SentimentIntensityAnalyzer()
    
    sentiments = []
    locations = {}
    all_words = []
    
    for review in reviews:
        text = review['text']
        location = review['location']
        
        sentiment = sia.polarity_scores(text)
        sentiments.append(sentiment['compound'])
        
        if location not in locations:
            locations[location] = []
        locations[location].append(sentiment['compound'])
        
        words = word_tokenize(text.lower())
        stop_words = set(stopwords.words('english'))
        words = [word for word in words if word.isalnum() and word not in stop_words]
        all_words.extend(words)
    
    overall_sentiment = sum(sentiments) / len(sentiments)
    
    positive = len([s for s in sentiments if s > 0]) / len(sentiments)
    negative = len([s for s in sentiments if s < 0]) / len(sentiments)
    neutral = len([s for s in sentiments if s == 0]) / len(sentiments)
    
    word_freq = Counter(all_words)
    top_keywords = [{'word': word, 'count': count} for word, count in word_freq.most_common(30)]
    
    geo_sentiment = [
        {'location': loc, 'sentiment': sum(scores) / len(scores)}
        for loc, scores in locations.items()
    ]
    
    return {
        'overallSentiment': (overall_sentiment + 1) / 2,
        'sentimentBreakdown': {
            'positive': positive,
            'negative': negative,
            'neutral': neutral
        },
        'topKeywords': top_keywords,
        'geographicalData': geo_sentiment,
    }

def main():
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'No URL provided'}))
        return
    
    url = sys.argv[1]
    reviews, image_url, title = scrape_reviews(url)
    
    if not reviews:
        print(json.dumps({'error': 'No reviews found'}))
        return
    
    analysis = analyze_sentiment(reviews)
    
    reviews_text = ' '.join([rev['text'] for rev in reviews])
    summary = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "Create a concise summary of product reviews."
            },
            {
                "role": "user",
                "content": f"Create a short summary (around 100 words) for these reviews: {reviews_text}. Also in the output don't write any filler content like 'Here is a 200-word summary', just start the summary"
            }
        ],
        model="gemma2-9b-it",
    )
    
    insights = generate_insights(reviews_text)
    
    print(json.dumps({
        'analysis': analysis,
        'reviews': summary.choices[0].message.content,
        'insights': insights,
        'imageURL': image_url,
        'title': title
    }))

if __name__ == "__main__":
    main()