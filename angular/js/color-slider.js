app.directive( 'colorSlider', [ '$document', 'ColorUtils', function ( $document, ColorUtils ) {
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

			scope.left = function () {
				return Math.round( scope.color[ scope.channel ] * ( scope.width - 24 ) / scope.max );
			};

			scope.begin = function ( event ) {

				event.preventDefault();
				event.stopPropagation();

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

