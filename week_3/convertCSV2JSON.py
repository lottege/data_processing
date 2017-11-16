import json
import csv

csvfile = open('Werkuren - Sheet1.csv', 'r')
jsonfile = open('uren.json', 'w')


fieldnames = ("maand", "uren")
reader = csv.DictReader(csvfile, fieldnames)
temp = []
for row in reader:
    temp.append(row)
json.dump(temp, jsonfile)
jsonfile.write('\n')
