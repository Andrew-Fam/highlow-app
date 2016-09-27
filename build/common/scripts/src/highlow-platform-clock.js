$(document).ready(function(){

	function updateClock ( )
	{
		var currentTime = new Date ( );

		var currentHours = currentTime.getHours ( );
		var currentMinutes = currentTime.getMinutes ( );
		var currentSeconds = currentTime.getSeconds ( );

		// Pad the minutes and seconds with leading zeros, if required
		currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
		currentSeconds = ( currentSeconds < 10 ? "0" : "" ) + currentSeconds;

		// Compose the string for display
		var currentTimeString = currentHours + ":" + currentMinutes + ":" + currentSeconds;

		// Update the time display
		$('.platform-clock-time').each(function(){

			$(this).html(currentTimeString);

		});
	}



  	if($('.platform-clock-time').length>0) {

  		updateClock();

  		setInterval(updateClock,1000);

  	}
	


});