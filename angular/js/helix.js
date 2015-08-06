app.directive( 'helix', [ 'ColorUtils', function ( ColorUtils ) {
	return {
		restrict: 'E',
		templateUrl: 'html/helix.html',
		scope: {
			colors: '=',
			rotations: '='
		},
		link: function ( scope, element, attrs ) {

			var g1 = new ColorUtils.Gradient();

			var steps = 200;
			var startRadii = [ 40, 200 ];
			var endRadii   = [ 140, 160 ];

			var canvas = element.find( 'canvas' )[ 0 ];
			var ctx = canvas.getContext( '2d' );
			ctx.lineWidth = 2;

			var render = function () {
				ctx.setTransform( 1, 0, 0, 1, 0, 0 );
				ctx.clearRect( 0, 0, 420, 420 );
				ctx.translate( 210, 210 );
				ctx.lineWidth = 6;
				ctx.lineCap = 'round';
				for ( var i = 0; i <= steps; i++ ) {
					ctx.save();
					ctx.rotate( ( scope.rotations * Math.PI ) * i/steps );
					ctx.strokeStyle = g1.colorAt( i/steps ).hex;
					ctx.beginPath();
					ctx.moveTo( 0, startRadii[ 0 ] - i/steps * ( startRadii[ 0 ] - endRadii[ 0 ] ) );
					ctx.lineTo( 0, startRadii[ 1 ] - i/steps * ( startRadii[ 1 ] - endRadii[ 1 ] ) );
					ctx.stroke();
					ctx.closePath();
					ctx.restore();
				}
			};



			for ( var i = 0; i < scope.colors.length; i++ ) {
				g1.addColorStop( i/(scope.colors.length-1), scope.colors[ i ] );
			}

			render();

			scope.$watch( 'colors[ 0 ].hex', render );
			scope.$watch( 'rotations', render );

		}
	};
}]);

