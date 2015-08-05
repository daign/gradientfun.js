var app = angular.module( 'Gradientfun', [] );

app.controller( 'GradientfunController', [ '$scope', 'ColorUtils', function ( $scope, ColorUtils ) {

	var colorA = new ColorUtils.Color();
	colorA.setHex( '#229999' );

	$scope.controlA = {
		color: colorA,
		callback: function () {
			$scope.controlA.color.updateFromHSL();
		}
	};

	$scope.one = 10;
	$scope.two = 20;
	$scope.three = 30;

}]);

