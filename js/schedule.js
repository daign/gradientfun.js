var SCHEDULE = {

	tasks: [],

	update: function () {

		for ( var i = 0; i < this.tasks.length; i++ ) {
			if ( this.tasks[ i ].scheduled ) {
				this.tasks[ i ].callback.apply( this.tasks[ i ].context );
				this.tasks[ i ].scheduled = false;
			}
		}

	},

	throttleRAF: function ( callback, context ) {

		var task = { scheduled: false, callback: callback, context: context };
		this.tasks.push( task );

		return function () {
			task.scheduled = true;
		};

	},

	throttle: function ( callback, wait, context ) { // wait 60 = 16fps // wait 40 = 25fps // wait 20 = 50fps

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

	},

	postpone: function ( callback, wait, context ) {

		return function () {
			setTimeout( function () {
				callback.apply( context || callback, arguments );
			}, wait );
		};

	}

};

