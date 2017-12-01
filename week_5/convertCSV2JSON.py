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

csvfile = open('/Users/lottegeereadts/PycharmProjects/data_processing/week_5/KNMI_20001231.txt', 'r')
jsonfile = open('/Users/lottegeereadts/PycharmProjects/data_processing/week_5/data1.json', 'w')

# set names for the different values and fill the file
fieldnames = ("Date1", "Avg", "Min", "Max")
reader = csv.DictReader(csvfile,  fieldnames)
temp = []
for row in reader:
    temp.append(row)
json.dump(temp,  jsonfile)
jsonfile.write('\n')
