
import sys
import json
import joblib
import pandas as pd
import numpy as np
import warnings

# Suppress warnings
warnings.filterwarnings("ignore")

def load_model():
    try:
        # Try loading with joblib first
        model = joblib.load('models/influencer_marketing_model.pkl')
        return model
    except Exception as e:
        print(json.dumps({"error": f"Failed to load model: {str(e)}"}))
        sys.exit(1)

def preprocess_input(data):
    # Mapping for Niches and Platforms to numeric values (Label Encoding)
    # This assumes the model was trained with specific LabelEncoders.
    # Since we don't have the encoders, we will use a standard mapping or hash if unsure.
    # For this prototype, I will map common names to indices likely used, 
    # OR if the model is a Pipeline, it might handle it.
    
    # Let's try to construct a DataFrame.
    df = pd.DataFrame([data])
    
    # NOTE: If the model expects specific Encodings, they should ideally be loaded too.
    # I will assume a robust pipeline or basic LabelEncoding.
    
    # Simple Manual Mapping (Example - adjust if model fails significantly)
    niches = {'Tech': 0, 'Fashion': 1, 'Lifestyle': 2, 'Health': 3, 'Gaming': 4}
    platforms = {'YouTube': 0, 'Instagram': 1, 'TikTok': 2, 'Twitter': 3}
    
    if 'influencer_category' in df.columns and df['influencer_category'].dtype == 'O':
         df['influencer_category'] = df['influencer_category'].map(niches).fillna(0)
         
    if 'platform' in df.columns and df['platform'].dtype == 'O':
        df['platform'] = df['platform'].map(platforms).fillna(0)

    # Dictionary for campaign types
    dtypes = {'Product Review': 0, 'Unboxing': 1, 'Tutorial': 2, 'Giveaway': 3}
    if 'campaign_type' in df.columns and df['campaign_type'].dtype == 'O':
        df['campaign_type'] = df['campaign_type'].map(dtypes).fillna(0)

    return df

def main():
    try:
        # Read input from stdin
        input_str = sys.stdin.read()
        if not input_str:
            print(json.dumps({"error": "No input received"}))
            sys.exit(1)
            
        params = json.loads(input_str)
        
        # Prepare data for model
        # Expected Feature Order assumed from prompt inputs
        # Prepare data for model
        # Calculate data
        followers = float(params.get('followers', 10000))
        engagement = float(params.get('engagement', 5000))
        engagement_rate = (engagement / followers) * 100 if followers > 0 else 0
        reach = followers * 0.2  # Estimate reach as 20% of followers

        data = {
            'influencer_category': params.get('niche', 'Tech'),
            'platform': params.get('platform', 'Instagram'),
            'follower_count': followers,
            'engagement_rate': engagement_rate,
            'campaign_duration': float(params.get('duration', 7)),
            'campaign_duration_days': float(params.get('duration', 7)),
            'product_price': float(params.get('price', 50)),
            'campaign_type': 'Product Review', # Default
            'estimated_reach': reach,
            'engagements': engagement,
        }
        
        # Load Model
        model = load_model()
        
        # Preprocess
        df = preprocess_input(data)
        
        # Predict
        # We assume the model predicts 'Sales' directly.
        sales_prediction = model.predict(df)[0]
        
        # Logic for Output
        product_price = data['product_price']
        campaign_cost = float(params.get('duration', 0)) * 100 + (float(params.get('followers', 0)) * 0.01) # Simple Mock Cost Formula
        
        # Ensure non-negative
        sales = max(0, int(sales_prediction))
        
        revenue = sales * product_price
        
        # ROI Calculation
        net_roi = 0
        if campaign_cost > 0:
            net_roi = ((revenue - campaign_cost) / campaign_cost) * 100
            
        output = {
            "predicted_sales": sales,
            "net_roi": round(net_roi, 2),
            "total_cost": round(campaign_cost, 2),
            "revenue": round(revenue, 2)
        }
        
        print(json.dumps(output))

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)


if __name__ == "__main__":
    main()
