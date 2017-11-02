#!/usr/bin/env python
# Name: Lotte Geeraedts
# Student number: 10529748
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
import csv
import re

from pattern.web import URL, DOM, plaintext, Element

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):

    # declare the observed URL
    url = URL(TARGET_URL)
    
    # download the URL to read the code
    dom = DOM(url.download(cached=True))

    # initialize list for the data we need
    data = []

    # iterate over parts of the list of tv series
    for e in dom('div[class="lister-item-content"]'):
        # look for title and accept all symbols
        title =  e('a')[0].content.encode("utf-8")
        
        # look for rating
        rating = e('div[class="inline-block \
                    ratings-imdb-rating"] strong')[0].content
        
        # initialize list for genres
        genre = []
        
        # calculate amount of genres
        alengte = len(e('span[class="genre"]'))
        
        # iterate over all genres
        for a in range(alengte):
            # look for genres and accept all symbols
            genres = e('span[class="genre"]')[a].content.encode("utf-8")
            
            # add new genre to list of genres
            genre.append(genres)

        # remove extra whitespace and join list with commas in between
        stripped_genres = (",".join([s.strip() for s in genre]))    
        
        # initialize list for actors
        actors = []
        
        # calculate amount of actors
        blengte = len(e('a')) 
        
        # start looking at position of first actor
        for b in range(12, blengte):
            # look for actor and make sure all symbols are accepted
            actor = e('a')[b].content.encode("utf-8")
            
            # add new actor to list
            actors.append(actor)
        
        # join actors with commas in between
        stripped_actors = (", ".join(actors))    
        
        # look for runtime
        runtime = e('span[class="runtime"]')[0].content
        
        # keep the digits, throw away 'min'
        runtime_digits = ''.join([i for i in runtime if i.isdigit()])

        # add the new data to data list
        data.append((title, rating, stripped_genres, 
                     stripped_actors, runtime_digits))

    # return the collected data
    return data  


def save_csv(f, tvseries):
    
    writer = csv.writer(f)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    # calculate the lenght of the list
    lengte = len(tvseries)
    
    # iterate over list and write row per row
    for a in range(lengte):
        writer.writerow(tvseries[a])

if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)
