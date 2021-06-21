var SocketIOClient = (function() {


	var client = function(url) {

		var me = this;
		me._connected=false;
		var socket = require('socket.io-client')(url);

		socket.on('disconnect', function() {

			me._isConnected=false;
        	console.log('disconnected')

        	me._socket.once('connect',function(){

        		//resubscribe!

        		Object.keys(me.subscriptions).forEach(function(channel){
        			me._socket.emit('subscribe', channel);
        		});
        		
        	})

		});

		socket.on('connect', function() {
			me._connected=true;
			console.log('connected')
		});
		
		

		console.log('created socket');

		me._socket = socket;



	};
	client.prototype = {}
	client.prototype.on = function(event, fn) {
		var me = this;
		me._socket.on(event, fn);
		return me;
	};
	client.prototype.close = function() {
		var me = this;
		me._socket.close();
		return me;
	};
	client.prototype.connect = function(credentials, fn) {
		var me = this;

		var auth=function(){
			me._socket.emit('authenticate', credentials fn);
		}
		if(me._connected){

			auth();
		}
		me._socket.on('connect', auth);

		me.subscriptions = {};

		return me
	};
	client.prototype.emit = function(channel, event, data, fn) {
		var me = this;
		console.log('emit');
		me._socket.emit('emit', {channel:channel+'/'+event, data:data}, fn);

		return me
	};
	client.prototype.subscribe = function(channel, event, callback) {
		var me = this;

		if (typeof event == 'string') {
			channel = channel + '/' + event;
		}

		if (typeof event == 'function' && (!callback)) {
			callback = event;
		}

		if (!me.subscriptions[channel]) {
			me._socket.emit('subscribe', channel);
			me.subscriptions[channel] = 0;
		}
		me.subscriptions[channel]++;


		me._socket.on(channel, callback);

		return function() {

			me.subscriptions[channel]--;
			if (me.subscriptions[channel] === 0) {
				me._socket.emit('unsubscribe', channel);
				delete me.subscriptions[channel];
			}


			me._socket.off(channel, callback);
		}
	};
	client.prototype.unsubscribe = function(subscription) {
		var me = this;
		subscription();
		return me;
	};
	client.prototype.presence = function(channel, event, callback) {
		var me = this;

		if (typeof event == 'string') {
			channel = channel + '/' + event;
		}

		if (typeof event == 'function' && (!callback)) {
			callback = event;
		}

		me._socket.emit('subscribe', channel + '.presence');
		me._socket.on(channel + '.presence', callback);

		return function() {
			me._socket.emit('unsubscribe', channel + '.presence');
			me._socket.off(channel + '.presence', callback);
		}
	};
	client.prototype.getId = function() {
		var me = this;
		return me._socket.id;
	};





return client;



})();

module.exports = SocketIOClient;