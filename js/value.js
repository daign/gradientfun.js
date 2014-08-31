var Value = function ( settings ) {

	// lower bound, obligatory argument
	var minimum = settings.minimum;

	// valid values have to be the sum of minimum and a multiple of step, optional argument
	var step = settings.step;

	// private function, aligns values to satisfy step size
	var alignToStep = function ( v, rounding ) {
		if ( step !== undefined ) {
			v = Math[ rounding ]( ( v - minimum ) / step ) * step + minimum;
		}
		return v;
	};

	// upper bound, obligatory argument, has to be greater than minimum and satisfy step size
	var maximum = Math.max( minimum, alignToStep( settings.maximum, 'floor' ) );
	if ( maximum !== settings.maximum ) {
		console.warn( 'aligned maximum to step size' );
	}
	if ( maximum === minimum ) {
		console.warn( 'maximum equals minimum' );
	}

	// minimum difference between values, optional argument, has to be smaller than range and
	// satisfy step size
	var gap = settings.gap;
	if ( gap !== undefined ) {
		gap = Math.min( maximum - minimum, alignToStep( gap, 'ceil' ) );
		if ( gap !== settings.gap ) {
			console.warn( 'aligned gap to step size' );
		}
		if ( gap === ( maximum - minimum ) ) {
			console.warn( 'gap equals range' );
		}
	}

	// listener functions will be called when value changes
	var listeners = [];

	// adds a listener function
	this.addListener = function ( l ) {
		listeners.push( l );
		return this;
	};

	// sets a value after conforming it to all restrictions
	this.set = function ( v, i ) {
		if ( !isNaN( v ) && i < values.length ) {
			var v0 = values[ i ];
			var lowerLimit = ( values[ i-1 ] !== undefined ) ? values[ i-1 ]+gap : minimum;
			var upperLimit = ( values[ i+1 ] !== undefined ) ? values[ i+1 ]-gap : maximum;
			v = Math.min( Math.max( v, lowerLimit ), upperLimit );
			values[ i ] = alignToStep( v, 'round' );
			if ( values[ i ] !== v0 ) {
				for ( var l = 0; l < listeners.length; l++ ) {
					listeners[ l ]();
				}
			}
		}
		return this;
	};

	// conforming initial values, obligatory argument
	var values = settings.values.slice();
	for ( var i = 0; i < values.length; i++ ) {
		this.set( values[ i ], i );
		if ( values[ i ] !== settings.values[ i ] ) {
			console.warn( 'aligned initial value' );
		}
	}

	// getters

	this.get = function ( i ) {
		return values[ i ];
	};

	this.getMin = function () {
		return minimum;
	};

	this.getMax = function () {
		return maximum;
	};

	this.getLen = function () {
		return values.length;
	};

	// snap and drag

	var snapshots = values.slice();

	this.snap = function ( i ) {
		snapshots[ i ] = values[ i ];
		return this;
	};

	this.drag = function ( offset, i ) {
		this.set( snapshots[ i ] + offset, i );
		return this;
	};

};

