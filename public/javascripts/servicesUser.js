 
miAplicacionUser.factory('sockets', function ($rootScope) {
    var socket = io.connect('http://localhost:3000', { 'forceNew': true });
    return {
        on: function (eventName, callback) {
        socket.on(eventName, function () {  
            var args = arguments;
            $rootScope.$applyAsync(function () {
            callback.apply(socket, args);
            });
        });
        },
        emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
            var args = arguments;
            $rootScope.$applyAsync(function () {
            if (callback) {
                callback.apply(socket, args);
            }
            });
        })
        }
    };
});
      