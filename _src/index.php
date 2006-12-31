<?php
switch (strtolower($_SERVER['SERVER_NAME']))
{
case 'yoursunny.com':header('Location: /h/');exit;break;
default:header('Location: http://yoursunny.com/');header('Status: 301');exit;break;
}
?>