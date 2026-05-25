from pytrends.request import TrendReq
import pandas as pd


def main():
    # Initialize Google Trends connection
    pytrends = TrendReq(hl="en-US", tz=360)

    # Keywords to analyze
    keywords = ["NVIDIA", "Artificial Intelligence"]

    # Build request payload
    pytrends.build_payload(
        kw_list=keywords,
        timeframe="today 3-m",
        geo="US"
    )

    # Retrieve interest over time
    trends_df = pytrends.interest_over_time()

    # Remove partial column if exists
    if "isPartial" in trends_df.columns:
        trends_df = trends_df.drop(columns=["isPartial"])

    # Display results
    print("\nGoogle Trends Data:")
    print(trends_df.head())

    # Save raw data locally
    output_path = "storage/raw/google_trends.csv"
    trends_df.to_csv(output_path)

    print(f"\nData saved to: {output_path}")


if __name__ == "__main__":
    main()