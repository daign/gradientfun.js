var throttle = function ( callback, wait, context ) { // wait 60 = 16fps // wait 40 = 25fps // wait 20 = 50fps

	var execute = function () {
		callback.apply( context || callback, arguments );
		setTimeout( function () {
			if ( interrupts ) {
				interrupts = false;
				execute();
			} else {
				canrun = true;
			}
		}, wait );
	};

	var canrun = true;
	var interrupts = false;

	return function () {
		if ( !canrun ) {
			interrupts = true;
			return;
		} else {
			canrun = false;
			execute();
		}
	};

};

