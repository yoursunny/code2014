// /m/ dialmyphone
// 2012-04-22

(function(){
if (!$.isFunction($.phono)) return;
var $d = $('#d_dialmyphone'); if ($d.length == 0) return;

if (/iphone|ios|android|symbian/i.test(navigator.userAgent)) {
	$d.text($d.attr('data-textdial')).attr('href',$d.attr('data-tel')).show();
	return;
}

var currentCall = null;
function reset() {
	currentCall = null;
	$d.text($d.attr('data-textdial'));
}

var phono = $.phono({
	apiKey: '638bf4dfcf4a715caf98c573eb353f55',
	onReady: function() {
		$d.show();
		reset();
	},
	onUnready: function() {
		$d.hide();
		reset();
	},
	phone: {
		wideband: false,
		ringbackTone: 'http://s.phono.com/ringtones/Diggztone_Vibe.mp3'
	}
});

$d.on('click', function(){
	if (currentCall) {
		currentCall.hangup();
		reset();
	} else {
		currentCall = phono.phone.dial($d.attr('data-destination'),{
			onHangup: function(){
				reset();
			},
			onError: function(){
				reset();
			},
			volume: 100
		});
		$d.text($d.attr('data-texthangup'));
	}
});


})();
