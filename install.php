<?php
require_once 'common.php';
$db->execute_sql(<<<EOT
CREATE TABLE IF NOT EXISTS `news` (
  `id` int(11) NOT NULL auto_increment,
  `title` varchar(200) NOT NULL,
  `content` varchar(10000) NOT NULL,
  PRIMARY KEY  (`id`)
)
EOT
);
$db->execute_sql(<<<EOT
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL auto_increment,
  `username` varchar(32) NOT NULL,
  `password` char(32) NOT NULL,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `username` (`username`)
)
EOT
);
$db->execute_sql(<<<EOT
INSERT INTO user (username,password) VALUES ('admin',MD5('admin'))
EOT
);
header('Content-Type: text/plain');
echo 'Database Installation Finished'
?>