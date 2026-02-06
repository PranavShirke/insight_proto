
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
        # The .pkl file contains the full Pipeline (preprocessing + model)
        model = joblib.load('models/influencer_marketing_model.pkl')
        return model
    except Exception as e:
        print(json.dumps({"error": f"Failed to load model: {str(e)}"}))
        sys.exit(1)

def main():
    try:
        # Read input from stdin
        input_str = sys.stdin.read()
        if not input_str:
            print(json.dumps({"error": "No input received"}))
            sys.exit(1)
            
        params = json.loads(input_str)
        
        # Extract Inputs
        followers = float(params.get('followers', 10000))
        engagement = float(params.get('engagement', 5000))
        duration = float(params.get('duration', 7))
        price = float(params.get('price', 50))
        
        # 1. Feature Engineering matching the Training Script
         "df['engagement_rate'] = (df['engagements'] / df['estimated_reach']) * 100"
         "df['engagement_rate'] = df['engagement_rate'].clip(1.0, 5.0)"
        
        reach = followers * 0.2  # Estimate reach as 20% of followers (Mock logic, consistent with current app)
        
        raw_er = (engagement / reach) * 100 if reach > 0 else 0
        er = np.clip(raw_er, 1.0, 5.0) # Apply the constraint from training
        
        # 2. Construct DataFrame with EXACT columns from training
        # Features: ['engagements', 'estimated_reach', 'campaign_duration_days', 'engagement_rate', 'platform', 'influencer_category', 'campaign_type']
        
        input_data = {
            'engagements': [engagement],
            'estimated_reach': [reach],
            'campaign_duration_days': [duration],
            'engagement_rate': [er],
            # Categorical: Pass STRINGS (The Pipeline handles OneHotEncoding)
            'platform': [params.get('platform', 'Instagram')], 
            'influencer_category': [params.get('niche', 'Tech')],
            'campaign_type': ['Product Review'] # Default fixed value
        }
        
        df = pd.DataFrame(input_data)
        
        # 3. Load Model (Pipeline)
        model_pipeline = load_model()
        
        # 4. Predict
        # The pipeline will handle StandardScaler and OneHotEncoder internally
        sales_prediction = model_pipeline.predict(df)[0]
        
        # 5. Business Logic Output
        # (Replicating the logic from the user's script for consistency)
        predicted_sales = max(0, int(sales_prediction * 0.8)) # 20% safety buffer from training script
        
        # Cost Logic
        niche = params.get('niche', 'Tech')
        cpm = 35 if niche == 'Tech' else 20
        fixed_fee = (reach / 1000) * cpm
        talent_fee = fixed_fee * (1 + (er / 10))
        
        revenue = predicted_sales * price
        commission = revenue * 0.10
        
        campaign_cost = talent_fee + commission
        
        # ROI
        cogs = revenue * 0.40
        net_profit = revenue - campaign_cost - cogs
        
        net_roi = 0
        if campaign_cost > 0:
            net_roi = (net_profit / campaign_cost) * 100
            
        output = {
            "predicted_sales": predicted_sales,
            "net_roi": round(net_roi, 2),
            "total_cost": round(campaign_cost, 2),
            "revenue": round(revenue, 2)
        }
        
        print(json.dumps(output))

    except Exception as e:
        # Capture precise error
        print(json.dumps({"error": f"Prediction failed: {str(e)}"}))
        sys.exit(1)

if __name__ == "__main__":
    main()
