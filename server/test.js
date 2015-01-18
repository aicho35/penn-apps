var arDrone = require('ar-drone');
var client = arDrone.createClient();

client.on('navdata', function(data)
{
	if(!data || !data.demo)
	{
		return;
	}	
	var diff =  0 - (data.demo.rotation.clockwise);
	diff = ((diff + 180) % 360) - 180;
	console.log(diff);
});

