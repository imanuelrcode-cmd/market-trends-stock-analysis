from pathlib import Path
from datetime import datetime, timezone
import time

import pandas as pd
import yfinance as yf


# ==========================================
# CONFIG
# ==========================================

TICKERS = [
    "AAPL",
    "MSFT",
    "TSLA",
    "NVDA",
    "AMZN"
]

PERIOD = "1y"
INTERVAL = "1d"

OUTPUT_DIR = Path("storage/raw/stocks")


# ==========================================
# HELPERS
# ==========================================

def ensure_output_dir():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def download_ticker_data(ticker: str) -> pd.DataFrame:
    """
    Download historical stock data using yfinance.
    """

    print(f"Downloading {ticker}...")

    df = yf.download(
        tickers=ticker,
        period=PERIOD,
        interval=INTERVAL,
        auto_adjust=True,
        progress=False
    )

    if df.empty:
        print(f"No data returned for {ticker}")
        return df

    df.reset_index(inplace=True)

    # Add metadata columns
    df["ticker"] = ticker
    df["ingestion_timestamp"] = datetime.now(timezone.utc)
    
    return df


def save_to_csv(df: pd.DataFrame, ticker: str):
    """
    Save dataframe to CSV.
    """

    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")

    file_path = OUTPUT_DIR / f"{ticker}_{timestamp}.csv"

    df.to_csv(file_path, index=False)

    print(f"Saved: {file_path}")


# ==========================================
# MAIN PIPELINE
# ==========================================

def main():

    ensure_output_dir()

    for ticker in TICKERS:

        try:
            df = download_ticker_data(ticker)

            if not df.empty:
                save_to_csv(df, ticker)

        except Exception as e:
            print(f"Error processing {ticker}: {e}")

        # Small delay to avoid rate limiting
        time.sleep(2)


if __name__ == "__main__":
    main()