var main = function () {

	this.node = document.createElement( 'canvas' );
	this.node.width = 420;
	this.node.height = 420;
	document.body.appendChild( this.node );

	var ctx = this.node.getContext( '2d' );

	var g1 = new Gradient();
	g1.addStop( 0.00, '#3b8f45' );
	g1.addStop( 0.25, '#e5d411' );
	g1.addStop( 0.50, '#4d91bc' );
	g1.addStop( 0.75, '#d02743' );
	g1.addStop( 1.00, '#765612' );

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
			ctx.strokeStyle = g1.getColor( i/steps );
			ctx.beginPath();
			ctx.moveTo( 0, 80 );
			ctx.lineTo( 0, 197 - 80*i/steps );
			ctx.stroke();
			ctx.closePath();
			ctx.restore();
		}
	};

	render();

	document.body.appendChild( document.createElement( 'br' ) );
	slider = document.createElement( 'input' );
	slider.type = 'range';
	slider.min = 0.5;
	slider.max = 10;
	slider.step = 0.01;
	slider.value = 8.1;
	slider.style.width = '420px';
	document.body.appendChild( slider );
	var onChange = function () {
		rotations = slider.value;
		render();
	};
	slider.addEventListener( 'mousemove', onChange, false );

};

