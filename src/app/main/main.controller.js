(function(){

    'use strict';

    var module = angular.module('app');

    module.controller('MainCtrl', function ($scope, MainService) {
        var ctrl = this;

        //this is where the user info will be
        ctrl.userInfo = [];

        //this is where we will store the selected repo info
        ctrl.repoInfo = null;

        ctrl.clearStates = function(){
            ctrl.repoInfo = null;
            ctrl.contributors = null;
            ctrl.error = false
        }

        //using debouce so we wont kill github from keyups...
        // This code will be invoked after .5secs after the model changed
        var findUsers = _.debounce(function (newVal, oldVal) {

            var noNewVal = newVal === oldVal;
            var noEmpty = newVal === "";

            if(noNewVal || noEmpty){
                //no new val, no need to send to server
                return;
            }

            $scope.$apply(function(){
                console.log('Name changed to ' + newVal);

                //clearing preview states
                ctrl.clearStates()

                //this will determine the different types of format
                //- user = userName
                //- repo = userName/repoName
                //- url = https://github.com/king2k23/railsshell
                var format


                if( !newVal.match(/\//) ){
                    //user format
                    console.log('user format');
                    format = 'user';

                }else if( newVal.split('/').length === 2 && newVal.split('/')[1].length > 0){
                    //repo format (also checking to make sure the repo is there)
                    console.log('repo format');
                    format = 'repo';

                }else if( newVal.match('https://github.com')){
                    //url format
                    console.log('url format');
                    format = 'url';
                }else{
                    console.log('wrong formatting');
                    ctrl.wrongFormat = true;
                    return;
                }

                ctrl.wrongFormat = false;

                //making the query call for the list of repos for a user
                var params = {
                    _username: newVal,
                    formatType: format
                }

                MainService.list( params ).then(function( data ){
                    // ctrl.searching = false;
                    ctrl.userInfo = data

                    if(format === 'repo'){
                        //find the proper repo from neeVal
                        var repoName = newVal.split('/')[1];
                        var repo = _.where(data, {name: repoName})[0];

                        if(!repo){
                            console.warn('Couldnt find the repo...');
                            return
                        }

                        ctrl.fetchRepo(repo);
                    }

                    if(format === 'url'){
                        //find the proper repo from neeVal
                        var repoName = newVal.split('https://github.com/')[1].split('/')[1];
                        var repo = _.where(data, {name: repoName})[0];

                        if(!repo){
                            console.warn('Couldnt find the repo...');
                            return
                        }

                        ctrl.fetchRepo(repo);
                    }

                    //sanity check
                    ctrl.error = false
                }, function(error){

                    //simple error state
                    ctrl.error = true;

                });

            });

        }, 500);

        //watching for changes on the model binded to the search field
        $scope.$watch(angular.bind(this, function (name) {
            return this.searchData;
        }), findUsers);


        ctrl.fetchRepo = function( repo ){
            MainService.fetchRepo( repo ).then(function( data ){
                // ctrl.searching = false;
                ctrl.repoInfo = data
            });

            MainService.fetchContributors( repo ).then(function( data ){
                // ctrl.searching = false;
                ctrl.contributors = data
            });

        }

    });

//end of module
})();
