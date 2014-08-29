var Value = {

	Limited: function ( settings ) {

		var value = settings.value;
		var minimum = settings.minimum;
		var maximum = settings.maximum;
		var snapshot = undefined;

		this.set = function ( v, i ) {
			if ( !isNaN( v ) ) {
				value = Math.min( maximum, Math.max( minimum, v ) );
			}
			return this;
		};

		this.get = function ( i ) {
			return value;
		};

		this.getMin = function () {
			return minimum;
		};

		this.getMax = function () {
			return maximum;
		};

		this.snap = function ( i ) {
			snapshot = value;
			return this;
		};

		this.drag = function ( offset, i ) {
			this.set( snapshot + offset );
			return this;
		};

		this.getLen = function () {
			return 1;
		};

	},

	Range: function ( settings ) {

		var values = settings.values;
		var minimum = settings.minimum;
		var maximum = settings.maximum;
		var gap = settings.gap;
		var snapshots = [ undefined, undefined ];

		this.set = function ( v, i ) {
			if ( !isNaN( v ) ) {
				if ( i === 0 ) {
					values[ 0 ] = Math.min( values[ 1 ] - gap, Math.max( minimum, v ) );
				} else {
					values[ 1 ] = Math.min( maximum, Math.max( values[ 0 ] + gap, v ) );
				}
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
			return 2;
		};

	}

};

