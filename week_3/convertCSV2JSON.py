'''
    convertCSV2JSON.py
    Lotte Geeraedts
    Data Processing
    Studentnummer: 10529748
    Location: https://github.com/lottege/data_processing/blob/master/week_3/convertCSV2JSON.py

    This function reads an csv file and creates a json file with the data from the csv.
'''

import json
import csv

csvfile = open('Werkuren - Sheet1.csv', 'r')
jsonfile = open('uren.json', 'w')

# set names for the different values and fill the file
fieldnames = ("maand", "uren")
reader = csv.DictReader(csvfile, fieldnames)
temp = []
for row in reader:
    temp.append(row)
json.dump(temp, jsonfile)
jsonfile.write('\n')
