from flask import Flask
from flask import render_template
from flask import send_from_directory
import pandas as pd
import json
import sys
sys.path.append('../pyzingchart')
import zingchart.plots as plots


app = Flask(__name__)
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


@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
