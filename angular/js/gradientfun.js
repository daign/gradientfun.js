var app = angular.module( 'Gradientfun', [] );

app.controller( 'GradientfunController', [ '$scope', 'ColorUtils', function ( $scope, ColorUtils ) {

	$scope.colorA = new ColorUtils.Color().setHex( '#229999' );

	$scope.one = 10;
	$scope.two = 20;
	$scope.three = 30;

}]);

