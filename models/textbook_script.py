from bs4 import BeautifulSoup
import requests
import csv

myfile = open("classes.csv", 'wb')
wr = csv.writer(myfile, quoting=csv.QUOTE_ALL)

final = set()
for i in range(100000, 200000):
	print i
	url = "http://ucla.verbacompare.com/comparison?id=" + str(i)
	r  = requests.get(url)
	data = r.text
	soup = BeautifulSoup(data, "html.parser")
	elements = {};
	for script in soup.find_all('script'):
		if 'Verba.Compare.Collections.Sections' in str(script):
			index = "0"
			for word in str(script).split(','):
				#instructor always comes first
				if "instructor" == word.split(":")[0].strip('"'):
					elements['instructor'] = word.split(":")[1].strip('"').decode("unicode-escape")
				#isbn number comes next, but doesnt always exist
				elif 'isbn' == word.split(":")[0].strip('"'):
					elements['isbn' + index] = word.split(":")[1].strip('"').decode("unicode-escape")
				#cover image comes next
				elif 'cover_image_url' == word.split(":")[0].strip('"'):
					elements['image' + index] = "https:" + word.split(":")[1].strip('"')
				#title is always guaranteed to occur for a book
				elif "title" == word.split(":")[0].strip('"') and word != '"title":null':
					#very first thing is title, corresponding to course title
					if index == "0":
						elements["class"] = word.split(":")[1].strip('"').decode("unicode-escape")
						index = "1"
					#if isbn number was not found before
					if not 'isbn' + index in elements:
						elements['isbn' + index] = ""
					#if image wasn't found before
					if not 'image' + index in elements:
						elements['image' + index] = ""
					elements['title' + index] = word.split(":")[1].strip('"').decode("unicode-escape")
				elif 'author' == word.split(":")[0].strip('"'):
					elements['author' + index] = word.split(":")[1].strip('"').decode("unicode-escape")
					#once the author field is hit, we've gotten all the data we need for this book
					index = str(int(index) + 1)

	if 'instructor' in elements and 'title1' in elements: 
		for j in range(1, int(index)):
			temp = [elements['instructor'], elements['class'],  elements['title' + str(j)], elements['author' + str(j)], elements['image' + str(j)], elements['isbn' + str(j)], str(i)]
			wr.writerow(temp)
			final.add(str(elements))
