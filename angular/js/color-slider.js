app.directive( 'colorSlider', [ '$document', 'ColorUtils', function ( $document, ColorUtils ) {
	return {
		restrict: 'E',
		templateUrl: 'html/color-slider.html',
		scope: {
			control: '=',
			component: '=',
			max: '=',
			width: '='
		},
		link: function ( scope, element, attrs ) {

			scope.left = function () {
				return Math.round( scope.control.color[ scope.component ] * ( scope.width - 24 ) / scope.max );
			};

			scope.begin = function ( event ) {

				event.preventDefault();
				event.stopPropagation();

				var startValue = scope.control.color[ scope.component ];
				var startPos = event.clientX;

				function cancelSelect( event ) {
					event.preventDefault();
					event.stopPropagation();
				}

				function mousemove( event ) {
					event.preventDefault();
					event.stopPropagation();
					scope.control.color[ scope.component ] = Math.max( 0, Math.min( scope.max, startValue + ( event.clientX - startPos ) * scope.max / ( scope.width - 24 ) ) );
					scope.control.callback();
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

