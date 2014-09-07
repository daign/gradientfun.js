Value.Vector2 = function ( x, y ) {

	this.x = x || 0;
	this.y = y || 0;

};

Value.Vector2.prototype = {

	constructor: Value.Vector2,

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

	copy: function ( v ) {
		this.x = v.x;
		this.y = v.y;
		return this;
	},

	clone: function () {
		return new Value.Vector2( this.x, this. y );
	},

	add: function ( v ) {
		this.x += v.x;
		this.y += v.y;
		return this;
	},

	sub: function ( v ) {
		this.x -= v.x;
		this.y -= v.y;
		return this;
	},

	addScalar: function ( s ) {
		this.x += s;
		this.y += s;
		return this;
	},

	multiplyScalar: function ( s ) {
		this.x *= s;
		this.y *= s;
		return this;
	},

	divideScalar: function ( s ) {
		var invScalar = 1 / s;
		this.x *= invScalar;
		this.y *= invScalar;
		return this;
	},

	min: function ( v ) {
		this.x = Math.min( this.x, v.x );
		this.y = Math.min( this.y, v.y );
		return this;
	},

	max: function ( v ) {
		this.x = Math.max( this.x, v.x );
		this.y = Math.max( this.y, v.y );
		return this;
	},

	distanceTo: function ( v ) {
		return Math.sqrt( Math.pow( this.x - v.x, 2 ) + Math.pow( this.y - v.y, 2 ) );
	}

};

