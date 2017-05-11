import csv

#hash table of book => first unique book_id
first_unique = {};

#hash table of all book_id => first unique book_id for that book
duplicates = {}

with open('book_info.csv', 'rU') as inp, open('book_info_clean.csv', 'wb') as outp:
	book_info = csv.reader(inp, dialect=csv.excel)
	cleaned = csv.writer(outp)
	for row in book_info:
		key = str(row[1]) + str(row[2]) + str(row[3])
		if key not in first_unique:
			first_unique[key] = row[0]
			cleaned.writerow(row)
			duplicates[row[0]] = row[0]
		else:
			duplicates[row[0]] = first_unique[key]
		# first_unique[key].extend(row[0])
with open('book_to_class.csv', 'rU') as inp, open('book_to_class_clean.csv', 'wb') as outp:
	book_to_class = csv.reader(inp, dialect=csv.excel)
	cleaned = csv.writer(outp)
	for row in book_to_class:
		row[0] = duplicates[row[0]]
		cleaned.writerow(row)

	



	

