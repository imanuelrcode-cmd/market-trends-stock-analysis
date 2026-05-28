import csv
import json
import os
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

import requests

from shared.logging import configure_logging, get_logger

TOKEN_URL = "https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token"
STATES_URL = "https://opensky-network.org/api/states/all"

# Small example bbox: Tel Aviv / Ben Gurion area
BBOX = {
    "lamin": 31.80,
    "lomin": 34.60,
    "lamax": 32.35,
    "lomax": 35.20,
}

OUTPUT_DIR = Path("opensky_example_output")
CSV_PATH = OUTPUT_DIR / "summary.csv"

logger = get_logger(__name__)


def require_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value


def bbox_area_sqdeg(box: dict) -> float:
    return round((box["lamax"] - box["lamin"]) * (box["lomax"] - box["lomin"]), 4)


def estimated_state_credit_cost(area: float) -> int:
    if area <= 25:
        return 1
    if area <= 100:
        return 2
    if area <= 400:
        return 3
    return 4


def avg(values: list[float]) -> float | None:
    if not values:
        return None
    return round(sum(values) / len(values), 2)


def get_access_token() -> str:
    client_id = require_env("OPENSKY_CLIENT_ID")
    client_secret = require_env("OPENSKY_CLIENT_SECRET")

    logger.info("Requesting OpenSky access token")

    response = requests.post(
        TOKEN_URL,
        data={
            "grant_type": "client_credentials",
            "client_id": client_id,
            "client_secret": client_secret,
        },
        timeout=30,
    )
    response.raise_for_status()
    return response.json()["access_token"]


def fetch_states(token: str) -> tuple[dict, dict]:
    logger.info("Fetching OpenSky state data", extra={"bbox": BBOX, "extended": 1})

    response = requests.get(
        STATES_URL,
        headers={"Authorization": f"Bearer {token}"},
        params={**BBOX, "extended": 1},
        timeout=60,
    )

    if response.status_code == 401:
        raise RuntimeError("401 Unauthorized: token expired or credentials are invalid.")
    if response.status_code == 429:
        retry_after = response.headers.get("X-Rate-Limit-Retry-After-Seconds", "unknown")
        raise RuntimeError(f"429 Too Many Requests: retry after {retry_after} seconds.")

    response.raise_for_status()
    return response.json(), dict(response.headers)


def summarize(payload: dict, headers: dict) -> dict:
    states = payload.get("states") or []

    country_counts = Counter()
    category_counts = Counter()
    velocities = []
    baro_altitudes = []
    geo_altitudes = []
    on_ground_total = 0

    for row in states:
        country = row[2] or "unknown"
        country_counts[country] += 1

        category = row[17] if len(row) > 17 else None
        category_counts[str(category)] += 1

        if row[8]:
            on_ground_total += 1
        if row[9] is not None:
            velocities.append(row[9])
        if row[7] is not None:
            baro_altitudes.append(row[7])
        if row[13] is not None:
            geo_altitudes.append(row[13])

    opensky_time = payload.get("time")
    area = bbox_area_sqdeg(BBOX)

    return {
        "run_ts_utc": datetime.now(timezone.utc).isoformat(),
        "opensky_time_utc": datetime.fromtimestamp(opensky_time, tz=timezone.utc).isoformat()
        if opensky_time
        else None,
        "bbox": BBOX,
        "bbox_area_sqdeg": area,
        "estimated_state_credits_this_call": estimated_state_credit_cost(area),
        "aircraft_total": len(states),
        "airborne_total": len(states) - on_ground_total,
        "on_ground_total": on_ground_total,
        "avg_velocity_ms": avg(velocities),
        "avg_baro_altitude_m": avg(baro_altitudes),
        "avg_geo_altitude_m": avg(geo_altitudes),
        "top_countries": dict(country_counts.most_common(10)),
        "category_counts": dict(category_counts.most_common()),
        "x_rate_limit_remaining": headers.get("X-Rate-Limit-Remaining"),
    }


def write_outputs(summary: dict) -> Path:
    OUTPUT_DIR.mkdir(exist_ok=True)

    json_path = OUTPUT_DIR / f"summary_{datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')}.json"
    json_path.write_text(json.dumps(summary, indent=2), encoding="utf-8")

    fieldnames = [
        "run_ts_utc",
        "opensky_time_utc",
        "bbox_area_sqdeg",
        "estimated_state_credits_this_call",
        "aircraft_total",
        "airborne_total",
        "on_ground_total",
        "avg_velocity_ms",
        "avg_baro_altitude_m",
        "avg_geo_altitude_m",
        "x_rate_limit_remaining",
        "top_countries",
        "category_counts",
    ]

    write_header = not CSV_PATH.exists()
    with CSV_PATH.open("a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        if write_header:
            writer.writeheader()
        writer.writerow(
            {
                **{k: summary[k] for k in fieldnames[:-2]},
                "top_countries": json.dumps(summary["top_countries"]),
                "category_counts": json.dumps(summary["category_counts"]),
            }
        )

    return json_path


def main() -> None:
    configure_logging(service_name="opensky_collector")

    token = get_access_token()
    payload, headers = fetch_states(token)
    summary = summarize(payload, headers)
    json_path = write_outputs(summary)

    logger.info(
        "OpenSky summary created",
        extra={
            "aircraft_total": summary["aircraft_total"],
            "airborne_total": summary["airborne_total"],
            "x_rate_limit_remaining": summary["x_rate_limit_remaining"],
        },
    )
    logger.info(
        "OpenSky outputs written",
        extra={"csv_path": str(CSV_PATH), "json_path": str(json_path)},
    )


if __name__ == "__main__":
    main()
