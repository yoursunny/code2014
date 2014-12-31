<?php
//comes from dabr
require_once 'OAuth.php';
$useroauth='|';

function user_oauth_sign(&$url, &$args = false) {
  
  $method = $args !== false ? 'POST' : 'GET';
  
  // Move GET parameters out of $url and into $args
  if (preg_match_all('#[?&]([^=]+)=([^&]+)#', $url, $matches, PREG_SET_ORDER)) {
    foreach ($matches as $match) {
      $args[$match[1]] = $match[2];
    }
    $url = substr($url, 0, strpos($url, '?'));
  }
  
  $sig_method = new OAuthSignatureMethod_HMAC_SHA1();
  $consumer = new OAuthConsumer(OAUTH_CONSUMER_KEY, OAUTH_CONSUMER_SECRET);
  $token = NULL;

  if (($oauth_token = $_GET['oauth_token']) && @$_COOKIE[OAUTH_REQUEST_TOKEN_SECRET_COOKIE]) {
    $oauth_token_secret = $_COOKIE[OAUTH_REQUEST_TOKEN_SECRET_COOKIE];
  } else {
    list($oauth_token, $oauth_token_secret) = explode('|', $GLOBALS['useroauth']);
  }
  if ($oauth_token && $oauth_token_secret) {
    $token = new OAuthConsumer($oauth_token, $oauth_token_secret);
  }
  
  $request = OAuthRequest::from_consumer_and_token($consumer, $token, $method, $url, $args);
  $request->sign_request($sig_method, $consumer, $token);
  
  switch ($method) {
    case 'GET':
      $url = $request->to_url();
      $args = false;
      return;
    case 'POST':
      $url = $request->get_normalized_http_url();
      $args = $request->to_postdata();
      return;
  }
}

function twitter_process($url, $post_data = false) {
  if ($post_data === true) $post_data = array();
  //Some POSTable twitter methods are on http://api.twitter.com not http://twitter.com
  if (isset($GLOBALS['useroauth'])) {
    user_oauth_sign($url, $post_data);
  } elseif (is_array($post_data)) {
    // Passing $post_data as an array to twitter.com (non-oauth) causes an error :(
    $s = array();
    foreach ($post_data as $name => $value)
      $s[] = $name.'='.urlencode($value);
    $post_data = implode('&', $s);
  }
  
  $ch = curl_init($url);

  if($post_data !== false) {
    curl_setopt ($ch, CURLOPT_POST, true);
    curl_setopt ($ch, CURLOPT_POSTFIELDS, $post_data);
  }

  //if (user_type() != 'oauth' && user_is_authenticated())
  //  curl_setopt($ch, CURLOPT_USERPWD, user_current_username().':'.$GLOBALS['user']['password']);

  curl_setopt($ch, CURLOPT_VERBOSE, 0);
  curl_setopt($ch, CURLOPT_HEADER, 0);
  curl_setopt($ch, CURLOPT_TIMEOUT, 10);
  //curl_setopt($ch, CURLOPT_USERAGENT, 'dabr');
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
  //curl_setopt($ch,CURLOPT_PROXY,'localhost:8888');
  //curl_setopt($ch,CURLOPT_PROXY,'localhost:8580');

  $response = curl_exec($ch);
  $response_info=curl_getinfo($ch);
  curl_close($ch);

  switch( intval( $response_info['http_code'] ) ) {
    case 200:
      $json = json_decode($response);
      if ($json) return $json;
      return $response;
    case 401:
      //user_logout();
      //theme('error', '<p>Error: Login credentials incorrect.</p>');
      die('twitter_process 401');
    case 0:
      //theme('error', '<h2>Twitter timed out</h3><p>Dabr gave up on waiting for Twitter to respond. They\'re probably overloaded right now, try again in a minute.</p>');
      die('twitter_process 0');
    default:
      $result = json_decode($response);
      $result = $result->error ? $result->error : $response;
      if (strlen($result) > 500) $result = 'Something broke on Twitter\'s end.';
      //theme('error', "<h2>An error occured while calling the Twitter API</h2><p>{$response_info['http_code']}: {$result}</p><hr><p>$url</p>");
      die('twitter_process '.htmlspecialchars($result));
  }
}


?>