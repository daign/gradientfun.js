/*
// set of instances of other value classes, is copied deep
Value.Set = function () {

	var values = [];

	this.addValue = function ( v ) {
		values.push( v );
		return this;
	};

	this.getValues = function () {
		return values.slice();
	};

	// sets this instance to the deep copied values of another instance
	this.copy = function ( s ) {
		values = [];
		var sValues = s.getValues();
		for ( var i = 0; i < sValues.length; i++ ) {
			values.push( sValues[ i ].clone() );
		}
		return this;
	};

	// generates a new instance with the same deep copied values
	this.clone = function () {
		return new Value.Set().copy( this );
	};

};
*/

