from flask import Flask, request, jsonify, render_template
import joblib

app = Flask(__name__)

# Load model yang sudah disimpan
model = joblib.load('model.pkl')


@app.route('/')
def home():
    return render_template("index.html")

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    features = [
        data['Tn'], data['Tx'], data['Tavg'], data['RH_avg'], data['ss'],
        data['ff_x'], data['ddd_x'], data['ff_avg'], data['Bulan'],
        data['ddd_car_C'], data['ddd_car_E'], data['ddd_car_N'], data['ddd_car_NE'],
        data['ddd_car_NW'], data['ddd_car_S'], data['ddd_car_SE'],
        data['ddd_car_SW'], data['ddd_car_W']
    ]
    prediction = model.predict([features])
    return jsonify({'RR': prediction.tolist()})

if __name__ == '__main__':
    app.run(debug=True)
