var Value = function ( settings ) {

	var values =  settings.values;
	var minimum = settings.minimum;
	var maximum = settings.maximum;
	var gap =     settings.gap;
	var snapshots = values.slice();

	this.set = function ( v, i ) {
		if ( !isNaN( v ) && i < values.length ) {
			var lowerLimit = ( values[ i-1 ] !== undefined ) ? values[ i-1 ]+gap : minimum;
			var upperLimit = ( values[ i+1 ] !== undefined ) ? values[ i+1 ]-gap : maximum;
			values[ i ] = Math.min( Math.max( v, lowerLimit ), upperLimit );
		}
		return this;
	};

	this.get = function ( i ) {
		return values[ i ];
	};

	this.getMin = function () {
		return minimum;
	};

	this.getMax = function () {
		return maximum;
	};

	this.snap = function ( i ) {
		snapshots[ i ] = values[ i ];
		return this;
	};

	this.drag = function ( offset, i ) {
		this.set( snapshots[ i ] + offset, i );
		return this;
	};

	this.getLen = function () {
		return values.length;
	};

};

