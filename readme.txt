simple_news

SQL injection demo application.

[How to install]
Deploy all files to a PHP server.
Create a user in MySQL, and create a database for this user.
Open common.php with Notepad2, modify this line:
$db=new dbMySQL('127.0.0.1','simple_news','MnzBxYhrfsQGbCR6','simple_news','',FALSE);
                 ^ server    ^ user        ^ password         ^ db_name
Hit http://your.server/install.php in your browser.


[How to use]
http://your.server/  Web site index page.
http://your.server/login.htm  Management login page.


[Support]
This application comes without support.
