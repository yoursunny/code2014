# -*- coding: utf-8 -*- 
from google.appengine.api import xmpp
from google.appengine.api import urlfetch
import base64,StringIO,urlparse,logging

fetchBot_version='20091008'

def ReceiveMessage(message):
	req=message.body.replace('\r','').split('\n',1)
	if len(req)!=2:return
	ID=req[0]
	request=base64.standard_b64decode(req[1])
	(url,status,headers,content)=ProcessRequest(request)
	headers['X-FetchBot-ID']=ID
	headers['X-FetchBot-version']=fetchBot_version
	b='HTTP/1.1 '+str(status)+'\r\n'
	for (header_key,header_value) in headers.iteritems():
		b+=header_key+': '+header_value+'\r\n'
	body=base64.standard_b64encode(b)+'\r\n'
	if not content is None:body+=base64.standard_b64encode(content)
	chunks=[]
	chunk_len=92160
	if len(body)<=chunk_len:
		chunks.append(body)
	else:
		for i in range(0,len(body),chunk_len):
			chunks.append(body[i:(i+chunk_len)])
	chunk_count=len(chunks)
	for i in range(chunk_count):
		resp=ID+':'+str(i)+':'+str(chunk_count)+'\r\n'+chunks[i]
		message.reply(resp)
	if url is None:url=''
	logging.debug('FetchBot url='+url+' status='+str(status)+' len='+str(len(body))+' chunk_count='+str(chunk_count))

def ProcessRequest(request):
	r=StringIO.StringIO(request)
	request_line=r.readline().split(' ',2)
	if len(request_line)!=3:
		return (None,500,{'X-FetchBot-Fault':'InvalidRequestLine'},None)
	method=request_line[0]
	url=urlparse.urlparse(request_line[1])
	headers={}
	while True:
		header_line=r.readline()
		if header_line=='':break
		if header_line=='\r\n':break
		header_pair=header_line.split(':',1)
		if len(header_pair)==2:
			headers[header_pair[0].strip()]=header_pair[1].strip()
	url=urlparse.urlunparse(url)
	payload=base64.standard_b64decode(r.read())
	r.close()
	if method=='GET' or method=='HEAD':payload=None
	p=None
	try:
		p=urlfetch.fetch(url,payload=payload,method=method,headers=headers,follow_redirects=False,deadline=10)
	except urlfetch.Error:
		return (url,500,{'X-FetchBot-Fault':'FetchError'},None)
	return (url,p.status_code,p.headers,p.content)
