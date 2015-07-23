// array of numeric values, asserted to satisfy several restrictions:
// - lie inside a range between lower and upper bound
// - be the sum of the lower bound and a multiple of a step size
// - when used with more than one value, values are further restricted in their range by their
//   adjacent values, not getting nearer to them as a certain gap size
Value.Limited = function ( settings ) {

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
	} else {
		gap = 0;
	}

	// listener functions will be called when value changes
	var listeners = ( settings.listeners !== undefined ) ? settings.listeners : [];

	// adds a listener function
	this.addListener = function ( l ) {
		listeners.push( l );
		return this;
	};

	// setters

	// private function that definitely sets a value to position i in the array, calling a listener
	// function if the value changed
	var setDirect = function ( v, i ) {
		var v0 = values[ i ];
		values[ i ] = v;
		if ( values[ i ] !== v0 ) {
			for ( var l = 0; l < listeners.length; l++ ) {
				listeners[ l ]();
			}
		}
	};

	// conforms a value to all restrictions
	var conform = function ( v, i ) {
		var lowerLimit = ( values[ i-1 ] !== undefined ) ? values[ i-1 ]+gap : minimum;
		var upperLimit = ( values[ i+1 ] !== undefined ) ? values[ i+1 ]-gap : maximum;
		v = Math.min( Math.max( v, lowerLimit ), upperLimit );
		v = alignToStep( v, 'round' );
		return v;
	};

	// sets a value after conforming it to all restrictions, stopping all animations
	this.set = function ( v, i ) {
		if ( !isNaN( v ) && i < values.length ) {
			if ( tweens[ i ] !== undefined ) {
				tweens[ i ].stop();
				tweens[ i ] = undefined;
			}
			setDirect( conform( v, i ), i );
		}
		return this;
	};

	// sets a value from relative position between minimum and maximum
	this.setRelative = function ( relativeValue, i ) {
		return this.set( minimum + relativeValue * ( maximum - minimum ), i );
	};

	// sets a value with an animation, stops previous animation if still running
	this.setAnimated = function ( v, i, duration ) {
		if ( !isNaN( v ) && i < values.length ) {
			if ( tweens[ i ] !== undefined ) {
				tweens[ i ].stop();
				tweens[ i ] = undefined;
			}
			tweens[ i ] = new TWEEN.Tween( { value: values[ i ] } )
				.to( { value: conform( v, i ) }, duration )
				.easing( TWEEN.Easing.Quadratic.Out )
				.onUpdate( function () {
					setDirect( this.value, i );
				} )
				.onComplete( function () {
					tweens[ i ] = undefined;
				} )
				.start();
		}
		return this;
	};

	// conforming initial values, obligatory argument
	var values = settings.values.slice();
	var tweens = [];
	for ( var i = 0; i < values.length; i++ ) {
		this.set( values[ i ], i );
		if ( values[ i ] !== settings.values[ i ] ) {
			console.warn( 'aligned initial value' );
		}
		// every value in the array has its own animation controller
		tweens[ i ] = undefined;
	}

	// getters

	this.getNumberOfValues = function () {
		return values.length;
	};

	this.get = function ( i ) {
		return values[ i ];
	};

	// get relative position between minimum and maximum
	this.getRelative = function ( i ) {
		return ( values[ i ] - minimum ) / ( maximum - minimum );
	};

	this.getValues = function () {
		return values.slice();
	};

	this.getMin = function () {
		return minimum;
	};

	this.getMax = function () {
		return maximum;
	};

	this.getMaxRange = function () {
		return maximum - minimum;
	};

	this.getStep = function () {
		return step;
	};

	this.getGap = function () {
		return gap;
	};

	this.getListeners = function () {
		return listeners.slice();
	};

	// snap and drag

	var snapshots = values.slice();

	// saves a snapshot copy of a value
	this.snap = function ( i ) {
		snapshots[ i ] = values[ i ];
		return this;
	};

	// changes a value by adding an offset to the last saved snapshot
	this.drag = function ( offset, i ) {
		this.set( snapshots[ i ] + offset, i );
		return this;
	};

	// changes a value by adding an offset relative to the maximum range to the last saved snapshot
	this.dragRelative = function ( relativeOffset, i ) {
		this.set( snapshots[ i ] + relativeOffset * ( maximum - minimum ), i );
		return this;
	};

	// randomize

	// private function to set all values to random values, the setter function and its arguments
	// used for this action have to be specified
	var randomValues = function ( setter, arguments ) {
		var lowerLimit = minimum;
		for ( var i = 0; i < values.length; i++ ) {
			var upperLimit = maximum - gap * ( values.length-1 - i );
			var r = Math.random() * ( upperLimit - lowerLimit ) + lowerLimit;
			lowerLimit = r + gap;
			setter.apply( this, [ r, i ].concat( arguments ) );
		}
	};

	// randomize with normal setter
	this.randomize = function () {
		randomValues( this.set, [] );
		return this;
	};

	// randomize with animated setter
	this.randomizeAnimated = function ( duration ) {
		randomValues( this.setAnimated, [ duration ] );
		return this;
	};

	// copy and clone

	// sets this instance to the values of another instance
	this.copy = function ( v ) {
		values    = v.getValues();
		minimum   = v.getMin();
		maximum   = v.getMax();
		step      = v.getStep();
		gap       = v.getGap();
		listeners = v.getListeners();
		return this;
	};

	// generates a new instance with the same values
	this.clone = function () {
		return new Value.Limited( {
			values: values.slice(),
			minimum: minimum,
			maximum: maximum,
			step: step,
			gap: gap,
			listeners: listeners.slice()
		} );
	};

};

