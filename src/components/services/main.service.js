(function(){

    'use strict';

    var module = angular.module('service.main', []);

    //the actually user of the account
    module.service('MainService', function($resource, UserRepoModel, ReposModel, ContributorsModel) {
        var service = this;

        var localFail = function(error){
            console.error(error);
        }

        //Note: this is a little wet, but keeping it that way to save time.

        service.list = function( data ){

            var params = data

            //if type if repo, we need to extract the user name
            if(data.formatType === 'repo'){
                params._username = data._username.split('/')[0]
            }

            //if type if url, we need to extract the user name...
            if(data.formatType === 'url'){
                params._username = data._username.split('https://github.com/')[1].split('/')[0]
            }


            var promise = UserRepoModel.query({}, params ).$promise;

            var success = function( response ){

                console.log('Repos listed: ', response)
            };

            promise.then(success, localFail);

            return promise;
        }

        service.fetchRepo = function( repo ){

            var params = {
                _owner: repo.owner.login,
                _repoName: repo.name
            }

            var promise = ReposModel.get({}, params ).$promise;

            var success = function( response ){

                console.log('Repos listed: ', response)
            };

            promise.then(success, localFail);

            return promise;
        }

        service.fetchContributors = function( repo ){

            var params = {
                _owner: repo.owner.login,
                _repoName: repo.name
            }

            var promise = ContributorsModel.query({}, params ).$promise;

            var success = function( response ){

                console.log('Contributors listed: ', response)
            };

            promise.then(success, localFail);

            return promise;
        }

        return service;
    });

    //end of module
})();
