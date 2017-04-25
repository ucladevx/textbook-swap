$("#ownedID").submit(function() {
	$.post("/api/owned_books/add", 
		{ user_id: "user", book_id: $("#wantform").serialize() },
		function(data){
			console.log('asdfasdf')
			if(data.status === 0)
				//append to ul
				console.log('asdf')
			else if(data.status === 1)
				console.log('db connection error')
			else if(data.status === 2)
				console.log('db query error')
			else if(data.status === 3)
				console.log('book already exists')
		},
		"json" 
	);
});