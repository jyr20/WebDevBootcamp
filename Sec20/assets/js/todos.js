// Check off specific todos by clicking
$('ul').on('click', 'li', function(){
	$(this).toggleClass('completed');
});

// Click on X to delete ToDo
$('ul').on('click', 'span', function(event){
	$(this).parent().fadeOut(500,function(){
		$(this).remove();
	});
	event.stopPropagation();
});

// Add listener for input
$('input[type="text"]').keypress(function(event){
	if(event.which === 13){
		// grab input text
		var todoText = $(this).val();
		// erase info ready for next time
		$(this).val('');
		// create new li and add to ul
		$('ul').append("<li><span><i class='fas fa-trash-alt'></i></span> " + todoText + "</li>");

	}

});

// Add input toggle
$('.fa-plus').click(function(){
	$('input[type="text"]').fadeToggle();
});
