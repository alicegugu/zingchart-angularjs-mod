from flask import Flask
from flask import render_template
from flask import send_from_directory
from  flask import request
import pandas as pd
import json
import sys
import ast

sys.path.append('../pyzingchart')
import zingchart.plots as plots


app = Flask(__name__)
iris = pd.read_csv('../data/iris.csv')
app.config['CUSTOM_STATIC_PATH'] = '../../src'

# Serve zingchart-angularjs-mod
@app.route('/cdn/<filename>')
def custom_static(filename):
	return send_from_directory(app.config['CUSTOM_STATIC_PATH'], filename)


@app.route('/scatterplot', methods=['GET'])
def scatterplot():
	xname = None
	yname = None
	plot_options = None
	groupby = None
	markers = "circle"
	colors = ["red", "blue", "green"]
	if request.args.get('groupby'):
		groupby = request.args.get('groupby')
	if request.args.get('xname'):
		xname = request.args.get('xname')
	if request.args.get('yname'):
		yname = request.args.get('yname')
	if request.args.get('plot_options'):
		plot_options = ast.literal_eval(request.args.get('plot_options'))
	if groupby:
		data = dict(list(iris.groupby(groupby)))
	else:
		data = iris

	return json.dumps(plots.scatterplot(data,
										markers=markers,
										colors=colors,
										xname=xname,
										yname=yname,
										plot_options=plot_options))


@app.route('/')
def index():
	return render_template('index.html')


if __name__ == '__main__':
	app.run(debug=True)
