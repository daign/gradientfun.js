// several mechanisms to manage the time-wise execution of functions
var SCHEDULE = {

	// first variant: a system of schedulable tasks.
	// loopedThrottle() gives back a modification of your function, that whenever called will
	// schedule your function for execution, but execution will only take place once a running loop
	// calls for update(). if the function was set to be scheduled several times since the last
	// update() it will still be called only once. looping the update() is managed by either
	// requestAnimationFrame() through startRAFLoop() or setInterval() through startIntervalLoop().

	tasks: [],

	startRAFLoop: function () {

		var animate = function () {
			requestAnimationFrame( animate );
			TWEEN.update();
			SCHEDULE.update();
		};

		animate();

	},

	startIntervalLoop: function ( wait ) {

		setInterval( function () {
			TWEEN.update();
			SCHEDULE.update();
		}, wait );

	},

	update: function () {

		for ( var i = 0; i < this.tasks.length; i++ ) {
			if ( this.tasks[ i ].scheduled ) {
				this.tasks[ i ].callback.apply( this.tasks[ i ].context );
				this.tasks[ i ].scheduled = false;
			}
		}

	},

	loopedThrottle: function ( callback, context ) {

		var task = { scheduled: false, callback: callback, context: context };
		this.tasks.push( task );

		return function () {
			task.scheduled = true;
		};

	},

	// other standalone mechanisms:

	// gives back a modification of your function, that whenever called will block all following
	// calls from execution for a specified time period
	blockingThrottle: function ( callback, context, wait ) { // wait 60 = 16fps // wait 40 = 25fps // wait 20 = 50fps

		var blocked = false;

		return function () {
			if ( blocked ) { return; }
			blocked = true;
			callback.apply( context, arguments );
			setTimeout( function () {
				blocked = false;
			}, wait );
		};

	},

	// gives back a modification of your function, that whenever called will block all following
	// calls from execution for a specified time period, but executes once at the end of the time
	// period if there was a blocked call in the meantime
	deferringThrottle: function ( callback, context, wait ) { // wait 60 = 16fps // wait 40 = 25fps // wait 20 = 50fps

		var execute = function () {
			callback.apply( context, arguments );
			setTimeout( function () {
				if ( deferredCalls ) {
					deferredCalls = false;
					execute();
				} else {
					blocked = false;
				}
			}, wait );
		};

		var blocked = false;
		var deferredCalls = false;

		return function () {
			if ( blocked ) {
				deferredCalls = true;
				return;
			} else {
				blocked = true;
				execute();
			}
		};

	},

	// gives back a modification of your function, that whenever called will only execute after a
	// specified time period has elapsed
	postpone: function ( callback, context, wait ) {

		return function () {
			setTimeout( function () {
				callback.apply( context, arguments );
			}, wait );
		};

	}

};

