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
    hideModal();
    chrome.extension.sendMessage({from: 'btn_answer'});
  });

  $('#btn_hangup').click(function() {
    chrome.extension.getBackgroundPage().KandyAPI.Phone.endCall(chrome.extension.getBackgroundPage().callId);
  });

  $('#btn_reject').click(function() {
    chrome.extension.getBackgroundPage().KandyAPI.Phone.rejectCall(chrome.extension.getBackgroundPage().callId);
  });
  $('#frm_send').submit(function(e){
  e.preventDefault();
  var $message=$('#txt_send').val();
  var $msgContainer = $("<li class='send'>");
  var $userLabel = $("<div class='contact-sender'>").text('You:');
  var $messageText = $("<p>").text($message);
  $msgContainer.append($userLabel, $messageText);
  $('#messages').append($msgContainer);
  $('#txt_send').val("");
  $(".messages").scrollTop($(".messages").get(0).scrollHeight);
  chrome.extension.sendMessage({from: 'msg_send',message:$message});
});
//init the popup if 
if (!chrome.extension.getBackgroundPage().isLoggedIn)
{
  $("#login-form").css("display", "block");
  $("#logged").css("display", "none");
  $('#oncall_screen').css('display', 'none');
  $('body').css('min-width','400px');
  $('body').css('min-height','700px');
}

if (chrome.extension.getBackgroundPage().isLoggedIn && !chrome.extension.getBackgroundPage().isOnCall)
{
	$("#login-form").css("display", "none");
  $('#logged').css('display', 'block');
  $('body').css('min-width','400px');
  $('body').css('min-height','500px');
}

if (chrome.extension.getBackgroundPage().isLoggedIn && chrome.extension.getBackgroundPage().isOnCall)
{
  $("#login-form").css("display", "none");
  $("#logged").css("display", "none");
  $('#oncall_screen').css('display', 'block');
}

});

function hideLogin()
{
	$("#login-form").css("display", "none");
  $('#logged').css('display', 'block');
  $('body').css('min-width','400px');
  $('body').css('min-height','500px');
}

function showModal()
{
	$('#modal_call').modal({
   show: 'true'
 });
}
function hideModal()
{
	$('#modal_call').modal({
   show: 'false'
 });
}

function localVideo(videoTag)
{
	$("#video_container")[0].innerHTML=videoTag;
}



function receiveMessages(msg)
{
  var $userSender   = $('<div class="contact-receiver">').text(msg.sender.user_id + ":");
  var $messageSend = $('<p>').text(msg.message.text);
  var $msgContainerSend = $("<li class='recieve'>");

  $msgContainerSend.append($userSender, $messageSend);

  $('#messages').append($msgContainerSend);
     
  $(".messages").scrollTop($(".messages").get(0).scrollHeight);
}
