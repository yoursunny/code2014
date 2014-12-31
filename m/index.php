<?php
require_once $_SERVER['DOCUMENT_ROOT'].'/include/2013.php';
include_once 'icons.inc.php';

function clock() {
	echo date('h:i A');
//<iframe src="http://free.timeanddate.com/clock/i3fwdybl/n393/ts1" width="62" height="18" frameBorder="0" style="vertical-align:top;"></iframe>
}

function phono_script() {
?>
<script src="http://s.phono.com/releases/1.1/jquery.phono.min.js"></script>
<script>
var phono = false;
var phono_call = false;
var phono_num = 'sip:17772715078@in.callcentric.com';
var phono_btn = $('#callBtn');
function phono_connect() {
  if (phono) return;
  phono = $.phono({
    apiKey: '638bf4dfcf4a715caf98c573eb353f55',
    audio: {type:'flash'},
    onReady: phono_ready
  });
}
function phono_ready() {
  phono.phone.wideband(false);
  phono.phone.ringbackTone('http://s.phono.com/ringtones/Diggztone_Vibe.mp3');
  phono_btn.attr('disabled', false).attr('class', 'btn btn-success').text(phono_btn.attr('data-t-call'))
  .click(function(){
    if (phono_call) {
      phono_call.hangup();
    } else {
      phono_dial();
    }
  });
}
function phono_dial() {
  phono_btn.attr('disabled', true).attr('class', 'btn').text(phono_btn.attr('data-t-calling'));
  phono_call = phono.phone.dial(phono_num, {
    onRing: function(){
      phono_btn.attr('disabled', false).attr('class', 'btn btn-info').text(phono_btn.attr('data-t-ringing')+' | '+phono_btn.attr('data-t-hangup'));
    },
    onAnswer: function(){
      phono_btn.attr('disabled', false).attr('class', 'btn btn-danger').text(phono_btn.attr('data-t-answered')+' | '+phono_btn.attr('data-t-hangup'));
    },
    onHangup: function(){
      phono_btn.attr('disabled', false).attr('class', 'btn btn-success').text(phono_btn.attr('data-t-call'));
      phono_call = false;
    }
  });
}
</script>
<?php
}

$PR->altlang();
include $PR->include_by_domain();
?>
