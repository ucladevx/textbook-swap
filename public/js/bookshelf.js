// init Isotope

// $(document).ready(function(){
// 	var elem = document.querySelector('.grid');
// 	var iso = new Isotope( elem, {
// 	  // options
// 	  itemSelector: '.grid-item',
// 	});

// });

$(document).ready(function(){
	$(".body").click(function(e) {
		console.log("grid click");
	});

	$(".filter-button").on('click', function () {
		console.log("click recognized");
		// var filterValue = button.getAttribute('data-filter');
		// iso.arrange({ filter: filterValue });
	});
});

// // filter items on button click
// $('.filter-button-group').on( 'click', 'button', function() {
//   var filterValue = $(this).attr('data-filter');

//   console.log(filterValue);

//   //$grid.isotope({ filter: filterValue });
// });