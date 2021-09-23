# push-node-socket-io-client
socketio client wrapper

##Install

npm install --save https://github.com/nickolanack/push-node-socket-io-client


##Usage


```js

const SocketIO=require("push-node-socket-io-client");

const config={
	server:"https://...",
	auth:{
		appId:"asdf...xxx",
		username:"Optional Display Name",
		//[password:"xxx"] //required to push data,
		//[token:"xxx"] //required to subscribe to non public channels
	}

}

const client = new SocketIOClient(config.server);
client.connect(config.auth, (success) => {

	if(!success){
		console.log("Failed to connect");
		return;
	}



}


```