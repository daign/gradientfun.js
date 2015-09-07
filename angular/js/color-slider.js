app.directive( 'colorSlider', [ '$document', 'ColorUtils', 'Schedule', function ( $document, ColorUtils, Schedule ) {
	return {
		restrict: 'E',
		templateUrl: 'html/color-slider.html',
		scope: {
			color: '=',
			channel: '=',
			width: '='
		},
		link: function ( scope, element, attrs ) {

			scope.max = ColorUtils.CHANNEL_MAX[ scope.channel ];

			var canvas = element.find( 'canvas' )[ 0 ];
			canvas.setAttribute( 'width', (scope.width-6) + 'px' );
			var ctx = canvas.getContext( '2d' );
			ctx.lineWidth = 2;

			var gradient = new ColorUtils.Gradient();
			var drawGradient = function () {
				for ( var i = 0; i <= ( scope.width-6); i+=2 ) {
					ctx.strokeStyle = gradient.colorAt( (i-9)/(scope.width-24) ).hex;
					ctx.beginPath();
					ctx.moveTo( i, 0 );
					ctx.lineTo( i, 18 );
					ctx.stroke();
				}
			};

			if ( scope.channel === 'hue' ) {
				gradient.setStops( [
					{ position: 0.00, color: new ColorUtils.Color().setHex( '#ff0000' ) },
					{ position: 0.17, color: new ColorUtils.Color().setHex( '#ffff00' ) },
					{ position: 0.33, color: new ColorUtils.Color().setHex( '#00ff00' ) },
					{ position: 0.50, color: new ColorUtils.Color().setHex( '#00ffff' ) },
					{ position: 0.67, color: new ColorUtils.Color().setHex( '#0000ff' ) },
					{ position: 0.83, color: new ColorUtils.Color().setHex( '#ff00ff' ) },
					{ position: 1.00, color: new ColorUtils.Color().setHex( '#ff0000' ) }
				] );
				drawGradient();
			} else {
				for ( var i = 0; i < 3; i++ ) {
					gradient.addColorStop( i/2, new ColorUtils.Color() );
				}

				var updateGradient = function () {
					for ( var i = 0; i < 3; i++ ) {
						var color = gradient.stops[ i ].color;
						color.copy( scope.color );
						color.setChannel( scope.channel, i * scope.max / 2 );
					}
					drawGradient();
				};
				var throttledUpdate = Schedule.deferringThrottle( updateGradient, this, 40 );
				throttledUpdate();

				scope.$watch( 'color.hash', throttledUpdate );
			}

			scope.left = function () {
				return Math.round( scope.color[ scope.channel ] * ( scope.width - 24 ) / scope.max );
			};

			scope.begin = function ( event, withJump ) {

				event.preventDefault();
				event.stopPropagation();

				if ( withJump ) {
					scope.color.setChannel( scope.channel, Math.max( 0, Math.min( scope.max, ( event.layerX - 10 ) * scope.max / ( scope.width - 24 ) ) ) );
				}

				var startValue = scope.color[ scope.channel ];
				var startPos = event.clientX;

				function cancelSelect( event ) {
					event.preventDefault();
					event.stopPropagation();
				}

				function mousemove( event ) {
					event.preventDefault();
					event.stopPropagation();
					scope.color.setChannel( scope.channel, Math.max( 0, Math.min( scope.max, startValue + ( event.clientX - startPos ) * scope.max / ( scope.width - 24 ) ) ) );
					scope.$apply();
				}

				function mouseup() {
					$document.off( 'selectstart', cancelSelect );
					$document.off( 'mousemove', mousemove );
					$document.off( 'mouseup', mouseup );
				}

				$document.on( 'selectstart', cancelSelect );
				$document.on( 'mousemove', mousemove );
				$document.on( 'mouseup', mouseup );

			};

		}
	};
}]);

