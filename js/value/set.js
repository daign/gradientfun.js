Value.Set = function () {

	var values = [];

	this.addValue = function ( v ) {
		values.push( v );
		return this;
	};

	this.getValues = function () {
		return values.slice();
	};

	this.copy = function ( s ) {
		values = [];
		var sValues = s.getValues();
		for ( var i = 0; i < sValues.length; i++ ) {
			values.push( sValues[ i ].clone() );
		}
		return this;
	};

	this.clone = function () {
		return new Value.Set().copy( this );
	};

};

