var app = angular.module( 'Gradientfun', [] );

app.controller( 'GradientfunController', [ '$scope', 'ColorUtils', function ( $scope, ColorUtils ) {

	var a = new ColorUtils.Color();

	$scope.one = 10;
	$scope.two = 20;
	$scope.three = 30;
	$scope.four = 40;

}]);

