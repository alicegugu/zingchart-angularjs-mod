from flask import Flask
from flask import render_template, send_from_directory, request
import pandas as pd
import json
import sys
from flask.ext.triangle import Triangle
sys.path.append('../pyzingchart')
import zingchart.plots as plots


app = Flask(__name__)
Triangle(app)
iris = pd.read_csv('../data/iris.csv')
app.config['CUSTOM_STATIC_PATH'] = '../../src'

# Serve zingchart-angularjs-mod
@app.route('/cdn/<filename>')
def custom_static(filename):
    return send_from_directory(app.config['CUSTOM_STATIC_PATH'], filename)

@app.route('/boxplot/<colume_name>')
def boxplot(colume_name):
    data = {}
    for f, df in iris.groupby("flower_type"):
        data[f] = df[colume_name]
    return json.dumps(plots.boxplot(data=data))


@app.route('/scatterplot', methods=['GET'])
def scatterplot():
	xname = None
	yname = None
	plot_options = None
	group = None
	markers = "circle"
	colors = ["red", "blue", "green"]
	if 'group' in request.args:
		group = request.args.get('group')
	if request.args.get('xname'):
		xname = request.args.get('xname')
	if request.args.get('yname'):
		yname = request.args.get('yname')
	if request.args.get('plot_options'):
		plot_options = ast.literal_eval(request.args.get('plot_options'))
	if group:
		data = iris[iris['flower_type'] == group]
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
