highlowApp.randomValue = function(from, to, decimal) {

	var factor = 1;

	if(decimal) {
		factor = decimal>0? Math.pow(10,decimal): 1;
	}

	var to = to * factor,
	from = from * factor;

	return Math.floor(Math.random() * (to-from+1)+from)/factor;
}

highlowApp.isNumber = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}