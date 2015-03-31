#!/usr/bin/env python
#

import os.path as path
import json
from flask import Flask, Response, request

app = Flask(__name__, static_url_path="", static_folder=path.join("..", "public"))
app.add_url_rule("/", "root", lambda: app.send_static_file("index.html"))

if __name__ == '__main__':
	app.run(port=3000, debug=True)