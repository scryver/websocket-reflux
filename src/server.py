#!/usr/bin/env python

import asyncio
import websockets


@asyncio.coroutine
def messageSwitcher(message):
	print(message)

@asyncio.coroutine
def ticker():
	yield from asyncio.sleep(1)
	return "tick"


class Server(websockets.WebSocketServerProtocol):

	def __init__(self, ws_handler, *args, origins=None, subprotocols=None, **kwargs):
		super(Server, self).__init__(ws_handler, origins=origins, subprotocols=subprotocols, **kwargs)

	@asyncio.coroutine
	def listener(self, path):
		while True:
			message = yield from self.recv()
			if message is None:
				break
			yield from messageSwitcher(message)

	@asyncio.coroutine
	def sender(self, path):
		while True:
			msg = yield from ticker()
			if not self.open:
				break
			yield from self.send(msg)

	@asyncio.coroutine
	def serve(self, path):
		yield from asyncio.wait([self.listener(path), self.sender(path)])


if __name__ == '__main__':

	startServer = websockets.serve(Server.serve, 'localhost', 8900, klass=Server)

	print("Starting server")
	asyncio.get_event_loop().run_until_complete(startServer)

	try:
		print("Running server")
		asyncio.get_event_loop().run_forever()
	except KeyboardInterrupt:
		pass
	finally:
		asyncio.get_event_loop().close()