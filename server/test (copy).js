var arDrone = require('ar-drone');
var client = arDrone.createClient();

client.takeoff();

client.on('navdata', function(data)
{
	if(!data || !data.demo)
	{
		return;
	}
	console.log(data.demo.rotation.clockwise);

	/*var diff =  0 - (data.demo.rotation.clockwise);
	diff = ((diff + 180) % 360) - 180;


		if(Math.abs(diff) < 5){
			// Zero velocity
			client.clockwise(0);
		}
		else if(diff < 0){
			// ccw
			console.log('GOING CCW');
			client.counterClockwise(0.1);
		}
		else{
			// cw
			console.log('GOING CW');
			client.clockwise(0.1);
		}

	console.log(diff);*/
});

