Value.Set = function () {

	values = [];

	this.addValue = function ( v ) {
		values.push( v );
		return this;
	};

	this.getValues = function () {
		return values.slice();
	};

	this.copy = function ( s ) {
		values = s.getValues();
		return this;
	};

	this.clone = function () {
		var s = new Value.Set();
		for ( var i = 0; i < values.length; i++ ) {
			s.addValue( values[ i ].clone() );
		}
		return s;
	};

};

