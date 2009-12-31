-- phpMyAdmin SQL Dump
-- version 3.0.0
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Feb 13, 2009 at 03:08 AM
-- Server version: 5.0.27
-- PHP Version: 5.2.7

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

--
-- Database: `a0113165307`
--

-- --------------------------------------------------------

--
-- Table structure for table `say100_msg`
--

CREATE TABLE IF NOT EXISTS `say100_msg` (
  `id` int(11) NOT NULL auto_increment,
  `sender` varchar(10) NOT NULL,
  `to` enum('friend','feed') NOT NULL,
  `text` varchar(500) NOT NULL,
  `t` datetime NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `say100_read`
--

CREATE TABLE IF NOT EXISTS `say100_read` (
  `msgid` int(11) NOT NULL,
  `reader` varchar(10) NOT NULL,
  `t` datetime default NULL,
  PRIMARY KEY  (`msgid`,`reader`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
