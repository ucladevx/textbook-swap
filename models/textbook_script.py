from bs4 import BeautifulSoup
import requests
import csv

myfile = open("classes.csv", 'wb')
wr = csv.writer(myfile, quoting=csv.QUOTE_ALL)

final = set()
for i in range(160000, 160100):
	url = "http://ucla.verbacompare.com/comparison?id=" + str(i)

	r  = requests.get(url)

	data = r.text

	soup = BeautifulSoup(data, "html.parser")
	elements = [];
	for script in soup.find_all('script'):
		if 'Verba.Compare.Collections.Sections' in str(script):
			for word in str(script).split(','):
				if "title" == word.split(":")[0].strip('"') and word != '"title":null':
					elements.append(word.split(":")[1].strip('"').decode("unicode-escape"))
				elif 'author' == word.split(":")[0].strip('"'):
					elements.append(word.split(":")[1].strip('"').decode("unicode-escape"))
				elif 'edition' == word.split(":")[0].strip('"') and word.split(":")[1].strip('"').isdigit():
					elements.append(word.split(":")[1].strip('"').decode("unicode-escape"))
				elif 'isbn' == word.split(":")[0].strip('"'):
					elements.append(word.split(":")[1].strip('"').decode("unicode-escape"))
		
	if len(elements) == 5 and str(elements) not in final:
		elements.append(str(i))
		wr.writerow(elements)
		final.add(str(elements))