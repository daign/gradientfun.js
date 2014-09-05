Vector2 = function ( x, y ) {

	this.x = x || 0;
	this.y = y || 0;

};

Vector2.prototype = {

	constructor: Vector2,

	set: function ( x, y ) {
		this.x = x;
		this.y = y;
		return this;
	},

	setFromEvent: function ( event ) {
		this.x = ( event.clientX !== undefined ) ? event.clientX : ( event.touches && event.touches[ 0 ].clientX );
		this.y = ( event.clientY !== undefined ) ? event.clientY : ( event.touches && event.touches[ 0 ].clientY );
		return this;
	},

	clone: function () {
		return new Vector2( this.x, this. y );
	}

};

