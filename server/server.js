var express = require('express'),
	app = express(),
	server = require('http').Server(app),
	io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/../web'));

server.listen(3000);

var started = false;
var arDrone = require('ar-drone');
var client  = arDrone.createClient();
var normalOrientation;
var currentOrientation;

var forward = false;
var numPeople = 0;
var lastDeflect;

io.on('connection', function(socket){
	console.log('connect');

	var id = ++numPeople;

	socket.on('disconnect', function(){
		console.log('disconnected');
	});

	socket.on('restart',function(){
		numPeople = 0;
		lastDeflect = undefined;
		forward = false;
		client.front(0);
		client.back(0);
		started = false;
	});

	// Start the game
	socket.on('start', function(){
		console.log('starting')
		
		numPeople = 0;
		lastDeflect = undefined;
		client.front(0);
		client.back(0);

		forward = false;
		client.takeoff();
		client.up(0.5);

		setTimeout(function(){
			client.up(0);
			started = true;
			normalOrientation = currentOrientation;
			/*setTimeout(function(){
				
			},1000);*/

		}, 3000);
	});

	// Stop the game
	socket.on('stop', function(){
		console.log('stop');
		client.land();
	});

	// Cause the copter to start moving in the opposite direction
	socket.on('deflect', function(data){
		if(lastDeflect != id)
		{
			lastDeflect = id;
			console.log('deflect' + id);
			forward = !forward;
			if(forward)
			{
			    client.front(0.3);
			}
			else
			{
			    client.back(0.3);
			}
			var angle = data.angle;
		}

	});


	socket.on('miss', function(){


	});

	socket.on('check_boundries', function()
	{

	});

});


client.on('navdata', function(data)
{
	if(!data || !data.demo)
	{
		return;
	}

	currentOrientation = data.demo.rotation.clockwise;

	if(started)
	{
		var diff =  normalOrientation - currentOrientation;
		diff = ((diff + 180) % 360) - 180;

		console.log("normal: " + normalOrientation + ", current: " +currentOrientation + ", diff: " + diff);

		if(Math.abs(diff) < 5){
			// Zero velocity
			client.clockwise(0);
		}
		else if(diff < 0){
			// ccw
			console.log('GOING CCW');
			client.counterClockwise(.1);
		}
		else{ 
			// cw
			console.log('GOING CW');
			client.clockwise(.1);
		}
	}	
	else
	{
		console.log("BATTERY: " + demo.batteryPercentage);	
	}
	
});



process.on('SIGINT', function(){
	console.log('Landing/Exiting...');

	client.land();

	setTimeout(function(){
		process.exit();
	}, 2000);

});
