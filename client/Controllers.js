app.factory('usersFactory', ['$http', function($http) {
  var usersFactory = function(){
    this.login = function(data,callback,errback){
      $http.post('/login',data).then(callback,errback);
    }
    this.index = function(callback){
      $http.get('/users').then(callback);
    }
    this.register = function(data,callback,errback){
      $http.post('/register',data).then(callback,errback);
    }

  }
  return new usersFactory;
}]);

app.controller('loginController', ['$scope', 'usersFactory', function($scope, uF){

  $scope.register = function(){

    uF.register($scope.registration, function(data){
      if (data.data.errors){
        $scope.errors = data.data.errors;
      }
      else{
        $scope.user = data.data;
      }
    }, function(err){
      console.log("I am an error",err);
    })
  }
  $scope.login = function(){
    uF.login(
      $scope.userLogin,
      function(data){
        if (data.data.errors){
          $scope.errors = data.data.errors;
        }
        else{
          $scope.user = data.data;
        }
      },
      function(err){
        console.log("I am an error",err);
      });
  }
}]);


app.controller('userController', function($scope, $routeParams, userFactory) {
	var id = $routeParams.id;

	$scope.checkUser = function(user) {
		userFactory.readUsers(user, function(data) {
		})
	}

	userFactory.viewUser(id, function(data) {
		$scope.user = data;
	})

})

app.controller('dashboardController', function($scope, topicFactory, userFactory) {
	$scope.newTopic = {};

	userFactory.readUser(function(data) {
		$scope.user = data;
	})

	$scope.createTopic = function(newTopic, name) {
		newTopic.name = name.name;
		newTopic.user_id = name._id;
		topicFactory.createTopic(newTopic, function(data, info) {
			userFactory.updateUserTopics(data, name, function(info) {});
			$scope.topics = data.data;
			$scope.newTopic = {};
			socket.emit('created_topic', data.info);
		})
	}

	socket.on('topic_added', function(data) {
		$scope.$broadcast("new_topic", data);
	})

	topicFactory.readTopics(function(data) {
		$scope.topics = data;
	})
})

app.directive("topics", function() { // Added to an HTML just as class or id
	return {
		restrict: "A",  // E for Element
		link: function($scope, $element) {
			$scope.$on("new_topic", function(event, data) {
				console.log(data);
				$element.find("tbody").append(
					"<tr>"
						+"<td>"+data.category+"</td>"
						+"<td><a href='#/topic/"+data._id+"'>"+data.title+"</a></td>"
						+"<td><a href='#/user/"+data.user_id+"'>"+data.name+"</a></td>"
						+"<td></td>"
				   +"<tr>"
				);
			});
		}
	}
})

app.controller('topicController', function($scope, $routeParams, topicFactory, postFactory, userFactory) {
	var id = $routeParams.id;
	var topic_id = null;

	userFactory.readUser(function(data) {
		$scope.name = data;
	})

	topicFactory.getTopic(id, function(data) {
		topic_id = data._id;
		$scope.topic = data;
		postFactory.readPosts(id, function(info) {
			$scope.posts = info;
		})


	})

	$scope.createPost = function(newPost, name) {
		newPost.name = name.name;
        newPost.topic_id = topic_id;
		newPost.user_id = name._id;
    	postFactory.createPost(newPost, function(data) {
			postFactory.readPosts(id, function(info) {
				$scope.posts = info;
				numOfPosts = info.length;
	    		topicFactory.updateTopic(numOfPosts, id, function(yep){})
	    		userFactory.updateUserPosts(info, name, function(yep){})
			})
		})
	}

	$scope.createComment = function(newComment, post, name) {
		postFactory.createComment(newComment, post, name, function(info) {
			$scope.posts = info;
		})
	}
})
