<?php
define('OAUTH_CONSUMER_KEY','zFEePVOn5jxJTSP0K541kA');
define('OAUTH_CONSUMER_SECRET','V8dBhqs2iodUgOn4IIJ16ZTwoYgseJWTuWyScvygTZg');
define('OAUTH_REQUEST_TOKEN_SECRET_COOKIE','twitter_oauth_request_token_secret');
require_once 'twitter_oauth.php';

if (isset($_GET['oauth_verifier'])) {
	$params = array('oauth_verifier'=>$_GET['oauth_verifier']);
	$response = twitter_process('https://api.twitter.com/oauth/access_token',$params);
	parse_str($response,$token);
	unset($_COOKIE[OAUTH_REQUEST_TOKEN_SECRET_COOKIE]);
	setcookie(OAUTH_REQUEST_TOKEN_SECRET_COOKIE);
	setcookie('a0bd74de',$token['oauth_token'].'|'.$token['oauth_token_secret']);
	header('Location: ./');
} else {
	$params = array('oauth_callback' => 'http://yoursunny.com/p/deletetweet/token.php');
	$response = twitter_process('https://api.twitter.com/oauth/request_token', $params);
	parse_str($response,$token);
	setcookie(OAUTH_REQUEST_TOKEN_SECRET_COOKIE,$token['oauth_token_secret']);
	$authorise_url = 'https://api.twitter.com/oauth/authenticate?oauth_token='.$token['oauth_token'];
	header("Location: $authorise_url");
}

?>
