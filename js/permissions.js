$(document).ready(function(){
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	console.log("====> Initializing Media Support");
	navigator.getUserMedia({audio: true, video: true}, function(stream){
		console.log("====> Media Initialized!!!!!");

	}, function(error){ 
		console.log("no webcam detected, trying to get access to microphone only");
		navigator.getUserMedia({audio: true, video: false}, function(stream){
			console.log("====> Media Initialized!!!!!");
		}, function(error){ 
			console.log(error);
		});
	});
});