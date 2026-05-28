import random
import time
from datetime import datetime
from pytrends.request import TrendReq

from shared.logging import configure_logging, get_logger

logger = get_logger(__name__)
REGION = "united_states"


def fetch_google_trends():
    logger.info(
        "Starting Google Trends fetch",
        extra={"region": REGION, "started_at": datetime.now().isoformat()},
    )

    # TODO: Need to check if pytrends requests are being blocked by Google.
    # If so, we may need additional throttling strategies beyond the simple
    # randomized delay below.
    # 1. Add a random delay before executing to avoid a strict "robotic" pattern
    delay = random.randint(5, 15)
    logger.info("Sleeping before Google Trends request", extra={"delay_seconds": delay})
    time.sleep(delay)

    # 2. Initialize pytrends with built-in retry logic
    # hl = language, tz = timezone offset (360 is US CST)
    pytrends = TrendReq(hl="en-US", tz=360, retries=3, backoff_factor=2)

    try:
        # 3. Fetch daily trending searches
        # Change 'united_states' to your target region if needed (e.g., 'united_kingdom', 'india')
        logger.info("Connecting to Google Trends", extra={"region": REGION})
        trends_df = pytrends.trending_searches(pn=REGION)

        # The returned data is a single column DataFrame. Let's clean it up.
        trends_df.columns = ["search_term"]
        trends_df["fetched_at"] = datetime.now()
        trends_df["rank"] = trends_df.index + 1

        logger.info(
            "Fetched Google Trends data successfully",
            extra={"region": REGION, "trend_count": len(trends_df)},
        )
        return trends_df

    except Exception:
        logger.exception("Error fetching data from Google Trends", extra={"region": REGION})
        # In Airflow, raising the error ensures the task is marked as "failed"
        # so you get alerted or it triggers a built-in Airflow retry.
        raise


if __name__ == "__main__":
    configure_logging(service_name="google_trends_collector")

    # Test execution
    df = fetch_google_trends()
    logger.info(
        "Preview of fetched search terms",
        extra={"region": REGION, "preview_terms": df.head(10)["search_term"].tolist()},
    )

    # Example: How you might save it locally
    # df.to_csv(f"trends_{datetime.now().strftime('%Y%m%d_%H%M%s')}.csv", index=False)
