var callId;
var isLoggedIn=false;
var $audioRingIn = $('<audio>', { loop: 'loop', id: 'ring-in' });
var $audioRingOut = $('<audio>', { loop: 'loop', id: 'ring-out' });

var $apiKey = 'DAK00068abf414f4e6fa818a123a1f3fd4d';

// Load audio source to DOM to indicate call events
var audioSource = {
  ringIn: [
  { src: 'https://kandy-portal.s3.amazonaws.com/public/sounds/ringin.mp3', type: 'audio/mp3' },
  { src: 'https://kandy-portal.s3.amazonaws.com/public/sounds/ringin.ogg', type: 'audio/ogg' }
  ],
  ringOut: [
  { src: 'https://kandy-portal.s3.amazonaws.com/public/sounds/ringout.mp3', type: 'audio/mp3' },
  { src: 'https://kandy-portal.s3.amazonaws.com/public/sounds/ringout.ogg', type: 'audio/ogg' }]
};

audioSource.ringIn.forEach(function(entry) {
  var $source = $('<source>').attr('src', entry.src);
  $audioRingIn.append($source);
});

audioSource.ringOut.forEach(function(entry) {
  var $source = $('<source>').attr('src', entry.src);
  $audioRingOut.append($source);
});

$(document).ready(function(){

  //request streaming permissions at extension install
  chrome.runtime.onInstalled.addListener(function(details){
    //ensure we have media stream permissions 
  chrome.windows.create({url:chrome.extension.getURL("permissions.html")},function(){ console.log("permissions window created")});
});
  
  //add default video containers
  $("body,html").append("<div id=\"video_container\"/>");
  $("body,html").append("<div id=\"incoming-video\"/>");

  $("#login-form").css("display", "none");
  chrome.browserAction.setPopup({popup: "index.html"});
  //recieves the username and password from form
  chrome.extension.onMessage.addListener(function(request, sender, response){
    console.log('User: ' + request.username + ' Pass: ' + request.password + ' from: ' + request.from); 
    
    if (request.from=="login")
    {
      var $username=request.username;
      var $password=request.password;
      kandy.setup({
        remoteVideoContainer:$("#video_container")[0],
        localVideoContainer:$("#incoming-video")[0],
        listeners: {
          /********* Login **********/
          loginsuccess: onLoginSuccess,
          loginfailed: onLoginFailed,

          /********* Call Listeners **********/
          callincoming: onCallIncoming,
          oncall: onCall,
          callanswered: onCallAnswer,
          callended: onCallTerminate,
          /*remotevideoinitialized:onRemoteVideoInitialized,
          localvideoinitialized:onLocalVideoInitialized*/
          /* callrejected: onCallRejected*/
        }
      });
      kandy.login($apiKey, $username, $password, onLoginSuccess, onLoginFailed);
    }

    //answers a call
    if (request.from=="btn_answer")
    {
      kandy.call.answerCall(callId,true);
      chrome.extension.getViews({type:'tab'})[0].hideModal();
      $audioRingOut[0].pause();
      $audioRingIn[0].pause();
    }
  });
});

function loadFile(filename){
  var file = document.createElement('script');
  file.setAttribute('type', 'text/javascript');
  file.setAttribute('src', filename);

  document.getElementsByTagName("head")[0].appendChild(file);
}

function onRemoteVideoInitialized(videoTag)
{
  chrome.extension.getViews({type:'popup'})[0].remoteVideo(videoTag);
}

function onLocalVideoInitialized(videoTag)
{
  chrome.extension.getViews({type:'popup'})[0].localVideo(videoTag);
}
function onLoginSuccess(){
  isLoggedIn=true;
  console.log("===> Login Success!");
  chrome.extension.getViews({type:'popup'})[0].hideLogin(); 
}

function onLoginFailed(){
  console.log("===> Login Failed!");        
}

function onKandyLogout(){
 console.log('===> User Logout!');
 $("#login-form").css("display", "block");
 $('#oncall_screen').css('display', 'none');
}


function onCallIncoming(call, isAnonymous){
 console.log('===> Incoming call!');
 callId = call.getId();
 //

 $audioRingIn[0].play();
 console.log('Call Id = ' + callId);

        var noti_opt = {
          type: "basic",
          title: "Incoming Call!",
          message: "Click Here To Answer the Call!",
          iconUrl: "assets/nexogy-icon.png"
        }

      chrome.notifications.create("incoming_call!", noti_opt, function(){});
      chrome.notifications.onClicked.addListener(function(){
        
        chrome.tabs.create({'url': chrome.extension.getURL('index.html')}, function(){
          chrome.extension.getViews({type:'tab'})[0].showModal();
        });

      });
}

function onCallAnswer(call) {
  callId = call.getId();

  chrome.extension.getViews({type:'tab'})[0].hideModal();

  $audioRingOut[0].pause();
  $audioRingIn[0].pause();
}

function onCall(call) {
  console.log('===> oncall');
  $audioRingOut[0].pause();

  $('#modal_call').modal({
   show: 'false'
 });

}

function onCallTerminate(call) {
  console.log('===> call ended');
  callId = null;

  $audioRingIn[0].pause();
  $audioRingOut[0].pause();
}
