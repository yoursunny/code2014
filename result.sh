#!/bin/sh
# yoursunny.P2008.VirusScanner 扫描结果显示脚本
# 调用方法：result.sh virus-name.txt file.list < result > result.txt

VIRUS_LIST=$1
FILE_LIST=$2

while read LINE
do
	FILE_ID=`echo $LINE | cut -d',' -f 1`
	FILE_LINE=`expr $FILE_ID + 1`
	POS=`echo $LINE | cut -d',' -f 2`
	VIRUS_ID=`echo $LINE | cut -d',' -f 3`
	FILE_NAME=`cat $FILE_LIST | head -n$FILE_LINE | tail -n1`
	VIRUS_NAME=`cat $VIRUS_LIST | grep ^$VIRUS_ID= | cut -d'=' -f 2`
	echo $FILE_ID','$FILE_NAME','$POS','$VIRUS_ID','$VIRUS_NAME
done

