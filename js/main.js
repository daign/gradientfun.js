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
	var rotations  = new Value( { values:      [ 332 ], minimum: 50, maximum: 1000 } );
	var startRadii = new Value( { values:  [ 40, 200 ], minimum:  0, maximum:  200, gap: 0 } );
	var endRadii   = new Value( { values: [ 140, 160 ], minimum:  0, maximum:  200, gap: 0 } );

	var render = function () {
		ctx.setTransform( 1, 0, 0, 1, 0, 0 );
		ctx.clearRect( 0, 0, 420, 420 );
		ctx.translate( 210, 210 );
		ctx.lineWidth = 6;
		ctx.lineCap = 'round';
		for ( var i = 0; i <= steps; i++ ) {
			ctx.save();
			ctx.rotate( ( rotations.get( 0 )*Math.PI/100 ) * i/steps );
			ctx.strokeStyle = g1.colorAt( i/steps ).getRGBA();
			ctx.beginPath();
			ctx.moveTo( 0, startRadii.get( 0 ) - i/steps * ( startRadii.get( 0 ) - endRadii.get( 0 ) ) );
			ctx.lineTo( 0, startRadii.get( 1 ) - i/steps * ( startRadii.get( 1 ) - endRadii.get( 1 ) ) );
			ctx.stroke();
			ctx.closePath();
			ctx.restore();
		}
	};
	var throttledRender = throttle( render, 40, this );

	render();

	document.body.appendChild( document.createElement( 'br' ) );

	document.body.appendChild( document.createTextNode( 'rotations:' ) );
	var s1 = document.createElement( 'div' );
	document.body.appendChild( s1 );
	new Slider( { value: rotations, domNode: s1, onChange: throttledRender } );

	document.body.appendChild( document.createTextNode( 'start radii:' ) );
	var s2 = document.createElement( 'div' );
	document.body.appendChild( s2 );
	new Slider( { value: startRadii, domNode: s2, onChange: throttledRender } );

	document.body.appendChild( document.createTextNode( 'end radii:' ) );
	var s3 = document.createElement( 'div' );
	document.body.appendChild( s3 );
	new Slider( { value: endRadii, domNode: s3, onChange: throttledRender } );

	var onResize = function () {
		var event = new Event( 'resize' );
		s1.dispatchEvent( event );
		s2.dispatchEvent( event );
		s3.dispatchEvent( event );
	};
	window.addEventListener( 'resize', onResize, false );

};

