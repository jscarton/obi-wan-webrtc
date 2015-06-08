$(document).ready(function(){
$('#frmLogin').submit(function(e){
    e.preventDefault();
    var username = $("#txt_username").val();
    var password = $("#txt_password").val();
    
    chrome.extension.sendMessage({from: 'login',
                    username: username,
                    password: password});
  });

$('#btn_signout').click(function(){
 kandy.logout(onKandyLogout);	
});

$('#btn_show').click(function(){
  $('#modal_call').modal({
   show: 'true'
 });
});

$('#btn_answer').click(function() {
  chrome.extension.sendMessage({from: 'btn_answer'});
});

$('#btn_hangup').click(function() {
  chrome.extension.getBackgroundPage().KandyAPI.Phone.endCall(chrome.extension.getBackgroundPage().callId);
});

$('#btn_reject').click(function() {
  chrome.extension.getBackgroundPage().KandyAPI.Phone.rejectCall(chrome.extension.getBackgroundPage().callId);
});
//init the popup if 
if (chrome.extension.getBackgroundPage().isLoggedIn)
{
	$("#login-form").css("display", "none");
 	$('#oncall_screen').css('display', 'block');
 	$('body,html').css('min-width','500px');
 	$('body,html').css('min-height','300px');	
}

});

function hideLogin()
{
	$("#login-form").css("display", "none");
 	$('#oncall_screen').css('display', 'block');
 	$('body,html').css('min-width','500px');
 	$('body,html').css('min-height','300px');
}
function showModal()
{
	$('#modal_call').modal({
   		show: 'true'
 	});
}
function showModal()
{
	$('#modal_call').modal({
   		show: 'false'
 	});
}

function remoteVideo(videoTag)
{
	$("#video_container")[0].append(videoTag);
}

function getRemoteVideoContainer()
{
	$("#incoming-video")[0].append(videoTag);
}