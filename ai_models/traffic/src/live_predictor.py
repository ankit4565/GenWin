from __future__ import annotations

import time
from datetime import datetime

from predictor import predict_latest_sample


def run_live_prediction(poll_seconds: int = 300, iterations: int | None = None) -> None:
    """Continuously score the latest traffic sample from the raw feed."""

    count = 0

    while True:
        result = predict_latest_sample()
        timestamp = datetime.now().isoformat(timespec="seconds")
        print(f"[{timestamp}] {result}")

        count += 1
        if iterations is not None and count >= iterations:
            break

        time.sleep(poll_seconds)


if __name__ == "__main__":
    run_live_prediction()