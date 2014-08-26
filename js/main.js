var main = function () {

	this.node = document.createElement( 'canvas' );
	this.node.width = 420;
	this.node.height = 420;
	document.body.appendChild( this.node );

	var ctx = this.node.getContext( '2d' );

	var g1 = new Gradient();
	g1.addColorStop( 0.00, new Color().setFromHex( '#3b8f45', 1 ) );
	g1.addColorStop( 0.25, new Color().setFromHex( '#e5d411', 1 ) );
	g1.addColorStop( 0.50, new Color().setFromHex( '#4d91bc', 1 ) );
	g1.addColorStop( 0.75, new Color().setFromHex( '#d02743', 1 ) );
	g1.addColorStop( 1.00, new Color().setFromHex( '#765612', 1 ) );

	var steps = 200;
	var rotations = 8.1;

	var render = function () {
		ctx.setTransform( 1, 0, 0, 1, 0, 0 );
		ctx.clearRect( 0, 0, 420, 420 );
		ctx.translate( 210, 210 );
		ctx.lineWidth = 6;
		ctx.lineCap = 'round';
		for ( var i = 0; i <= steps; i++ ) {
			ctx.save();
			ctx.rotate( ( rotations*Math.PI ) * i/steps );
			ctx.strokeStyle = g1.colorAt( i/steps ).getRGBA();
			ctx.beginPath();
			ctx.moveTo( 0, 80 );
			ctx.lineTo( 0, 197 - 80*i/steps );
			ctx.stroke();
			ctx.closePath();
			ctx.restore();
		}
	};
	var throttledRender = throttle( render, 40, this );

	render();

	var slider = new Slider( {
		min: 50,
		max: 1000,
		values: [ 810 ],
		onChange: function ( v ) { rotations = v[ 0 ]/100; throttledRender(); }
	} );
	document.body.appendChild( slider.domNode );

};

