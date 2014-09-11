var SCHEDULE = {

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

	postpone: function ( callback, context, wait ) {

		return function () {
			setTimeout( function () {
				callback.apply( context, arguments );
			}, wait );
		};

	}

};

