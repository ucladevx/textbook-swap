$(document).ready(function(){
	$.ajax({url: "/api/owned_books/get_books",
		data: { user_id: "user" },
		success: function(response){
	 		if(response.status === 0){
				var booklist = response.data
				for (i=0; i<booklist.length; i++){
					$("#ownedList").append('<li class="list-group-item" id="'+booklist[i].book_id+'">'+booklist[i].book_id+'</li>')
				}
			}
			else if(response.status === 1)
				console.log('db connection error')
			else if(response.status === 2)
				console.log('db query error')
		}
	})
})

$("#addOwned").click(function() {
	var bookid = $("#ownedID").val()
	$("#ownedID").val('')
	$.post("/api/owned_books/add", 
		{ user_id: "user", book_id: bookid },
		function(data){
			if(data.status === 0){
				$("#ownedList").append('<li class="list-group-item" id="'+bookid+'"">'+bookid+'</li>')
			}
			else if(data.status === 1)
				console.log('db connection error')
			else if(data.status === 2)
				console.log('db query error')
			else if(data.status === 3){
				console.log('book already exists')
			}
		},
		"json" 
	)
})

$("body").on("click", ".list-group-item", function(){
	var element = this
	var bookid = this.id
	$.post("/api/owned_books/remove",
		{ user_id: "user", book_id: bookid },
		function(data){
			if(data.status === 0){
				element.remove()
			}
			else if(data.status === 1)
				console.log('db connection error')
			else if(data.status === 2)
				console.log('db query error')
			else if(data.status === 4){
				console.log('book does not exist')
			}
		},
		"json"
	)
})