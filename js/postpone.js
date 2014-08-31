var postpone = function ( callback, wait, context ) {

	return function () {
		setTimeout( function () {
			callback.apply( context || callback, arguments );
		}, wait );
	};

};

