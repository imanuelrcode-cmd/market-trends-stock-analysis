from __future__ import annotations

import json
import logging
import os
import sys
import time
from datetime import datetime, timezone
from typing import Any

LOG_LEVEL_ENV = "MARKET_TRENDS_LOG_LEVEL"
LOG_FORMAT_ENV = "MARKET_TRENDS_LOG_FORMAT"

_DEFAULT_LEVEL = "INFO"
_DEFAULT_FORMAT = "text"
_CONFIGURED = False

_RESERVED_RECORD_FIELDS = frozenset(logging.makeLogRecord({}).__dict__.keys()) | {
    "asctime",
    "message",
}


def _resolve_level(level: str | None) -> int:
    candidate = (level or os.getenv(LOG_LEVEL_ENV, _DEFAULT_LEVEL)).upper()
    return getattr(logging, candidate, logging.INFO)


def _resolve_format(log_format: str | None) -> str:
    candidate = (log_format or os.getenv(LOG_FORMAT_ENV, _DEFAULT_FORMAT)).lower()
    return "json" if candidate == "json" else "text"


def _record_context(record: logging.LogRecord) -> dict[str, Any]:
    return {
        key: value
        for key, value in record.__dict__.items()
        if key not in _RESERVED_RECORD_FIELDS and not key.startswith("_")
    }


class TextFormatter(logging.Formatter):
    converter = time.gmtime

    def format(self, record: logging.LogRecord) -> str:
        message = super().format(record)
        context = _record_context(record)
        if context:
            message = f"{message} | {json.dumps(context, default=str, sort_keys=True)}"
        return message


class JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        payload: dict[str, Any] = {
            "timestamp": datetime.fromtimestamp(record.created, tz=timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }

        payload.update(_record_context(record))

        if record.exc_info:
            payload["exception"] = self.formatException(record.exc_info)
        if record.stack_info:
            payload["stack"] = self.formatStack(record.stack_info)

        return json.dumps(payload, default=str, sort_keys=True)


def configure_logging(
    *,
    service_name: str | None = None,
    level: str | None = None,
    log_format: str | None = None,
    force: bool = False,
) -> None:
    """
    Configure root logging once per process.

    Best practice for this project:
    - call this from application entry points (scripts, Airflow tasks, services)
    - use get_logger(__name__) inside modules
    - emit logs to stdout so Airflow, containers, and log shippers can collect them
    """

    global _CONFIGURED

    root_logger = logging.getLogger()
    root_logger.setLevel(_resolve_level(level))

    if _CONFIGURED and not force:
        return

    if root_logger.handlers and not force:
        _CONFIGURED = True
        return

    handler = logging.StreamHandler(sys.stdout)
    if _resolve_format(log_format) == "json":
        formatter: logging.Formatter = JsonFormatter()
    else:
        formatter = TextFormatter(
            fmt="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
            datefmt="%Y-%m-%dT%H:%M:%SZ",
        )

    if service_name:
        handler.addFilter(lambda record: setattr(record, "service_name", service_name) or True)

    handler.setFormatter(formatter)

    root_logger.handlers.clear()
    root_logger.addHandler(handler)
    _CONFIGURED = True


def get_logger(name: str | None = None) -> logging.Logger:
    """
    Return a module-scoped logger.
    """

    return logging.getLogger(name)
