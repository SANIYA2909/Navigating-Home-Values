"""
"""
from flask import Flask, request, jsonify, render_template
import util
from flask_cors import CORS
import os
import pandas as pd

app = Flask(__name__, static_url_path='/static')
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/financial_tools')
def financial_tools():
    return render_template('financial_tools.html')

@app.route('/map')
def map_view():
    return render_template('map.html')

@app.route("/locations")
def get_location_names():
    response = jsonify({
        'locations':util.get_location_names()
        })
    response.headers.add('Access-Control-Allow-Origin','*')
    
    return response

@app.route("/predict", methods=['POST'])
def predict_home_price():
    data = request.form
    total_sqft = float(data['total_sqft'])
    location = request.form['location']
    bhk = int(request.form['bhk'])
    bath = int(request.form['bath'])
    
    response = jsonify({
        'estimated_price': util.get_estimated_price(location, total_sqft, bhk, bath)
        })
    
    response.headers.add('Access-Control-Allow-Origin','*')
    #response.headers.add('Content-Type','application/json')
    
    return response


def prepare_data():
    try:
        df = pd.read_csv(r"C:\Users\TANZELA\Navigating-Home-Values\model\bengaluru_house_prices.csv")  # Adjust path as per your dataset location
        df['size'] = df['size'].apply(lambda x: int(x.split(' ')[0]) if isinstance(x, str) else x)
        df['total_sqft'] = pd.to_numeric(df['total_sqft'], errors='coerce')
        df['price_per_sqft'] = df['price'] / df['total_sqft']
        print(f"Data loaded successfully. Shape: {df.shape}")
        return df
    except FileNotFoundError as e:
        print(f"Error: The file 'C:\\Users\\TANZELA\\Navigating-Home-Values\\model\\bengaluru_house_prices.csv' was not found. {e}")
    except Exception as e:
        print(f"An error occurred during data preparation: {e}")
    return None

@app.route('/api/mortgage', methods=['POST'])
def calculate_mortgage():
    data = request.json
    loan_amount = float(data['loanAmount'])
    interest_rate = float(data['interestRate']) / 100
    loan_term = int(data['loanTerm'])
    
    monthly_interest_rate = interest_rate / 12
    num_payments = loan_term * 12
    
    monthly_payment = (loan_amount * monthly_interest_rate) / (1 - (1 + monthly_interest_rate) ** -num_payments)
    
    return jsonify({'monthly_payment': round(monthly_payment, 2)})


if __name__ == "__main__":
    df = prepare_data()  # Assuming prepare_data loads your dataset
    print("Data preparation completed.")
    print(df.head())
    print('Server up and running')
    util.load_saved_artifacts()
    app.run(debug=True)
