# -*- coding: utf-8 -*- 
from google.appengine.api import xmpp
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
import logging,xmppbot.fetchbot

class XMPPHandler(webapp.RequestHandler):
	def post(self):
		message=xmpp.Message(self.request.POST)
		to=message.to
		to=to[:to.index('@')]
		if to=='jid':
			xmppbot.fetchbot.ReceiveMessage(message)
		else:
			pass

application = webapp.WSGIApplication([('/_ah/xmpp/message/chat/',XMPPHandler)])

def main():
	run_wsgi_app(application)

if __name__ == "__main__":
	main()