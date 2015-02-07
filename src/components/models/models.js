(function(){

    'use strict';

    var module = angular.module('models', []);

    var endpointBase = 'https://api.github.com'

    //Note: keeping these models a little wet for simplicity. Would use https://github.com/mgonto/restangular
    //for a more scalable app

    //https://api.github.com/users/king2k23/repos
    module.factory('UserRepoModel', function($resource) {

        var paramDefaults = {
            username:'@_username'
        }

        return $resource(endpointBase + '/users/:username/repos', paramDefaults);
    });

    //https://api.github.com/repos/king2k23/stock-exchange
    module.factory('ReposModel', function($resource) {

        var paramDefaults = {
            owner:'@_owner',
            repo:'@_repoName'
        }

        return $resource(endpointBase + '/repos/:owner/:repo', paramDefaults);
    });

    //https://api.github.com/repos/king2k23/stock-exchange/contributors
    module.factory('ContributorsModel', function($resource) {

        var paramDefaults = {
            owner:'@_owner',
            repo:'@_repoName'
        }

        return $resource(endpointBase + '/repos/:owner/:repo/contributors', paramDefaults);
    });


    //end of module
})();
