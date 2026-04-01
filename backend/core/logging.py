from __future__ import annotations

import contextvars
import logging
import sys


_request_id: contextvars.ContextVar[str] = contextvars.ContextVar("request_id", default="-")


class RequestIdFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        record.request_id = _request_id.get("-")
        return True


def set_request_id(value: str) -> None:
    _request_id.set(value)


def clear_request_id() -> None:
    _request_id.set("-")


def setup_logging() -> None:
    root = logging.getLogger()
    if getattr(setup_logging, "_configured", False):
        return

    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(errors="backslashreplace")
        except Exception:
            pass

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(
        logging.Formatter(
            fmt="%(asctime)s | %(levelname)s | %(request_id)s | %(name)s | %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )
    )
    handler.addFilter(RequestIdFilter())

    root.handlers.clear()
    root.addHandler(handler)
    root.setLevel(logging.INFO)
    setup_logging._configured = True


def get_logger(name: str) -> logging.Logger:
    logger = logging.getLogger(name)
    if not any(isinstance(f, RequestIdFilter) for f in logger.filters):
        logger.addFilter(RequestIdFilter())
    return logger
