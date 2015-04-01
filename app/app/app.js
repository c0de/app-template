var app,
  services    = angular.module('myApp.services',    []),
  directives  = angular.module('myApp.directives',  []),
  filters     = angular.module('myApp.filters',     []),
  controllers = angular.module('myApp.controllers', []);

app = angular.module('myApp', [
  'myApp.services',
  'myApp.directives',
  'myApp.filters',
  'myApp.controllers',
  'ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/main');
  $stateProvider
    .state('main', { url: '/main', page: 'main', controller: 'Main', templateUrl: 'templates/main.html' });
});

app.run(function() {
  // run
});
