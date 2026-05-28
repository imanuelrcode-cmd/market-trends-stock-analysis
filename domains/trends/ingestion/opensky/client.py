from shared.logging import configure_logging, get_logger

logger = get_logger(__name__)


def main() -> None:
    configure_logging(service_name="opensky_client")
    logger.error("client.py is not meant to be run directly. Please run collector.py instead.")
    raise SystemExit(1)


if __name__ == "__main__":
    main()
