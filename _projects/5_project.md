---
layout: page
title: Nifty Options Backtester
description: High-performance options backtesting engine in C++ for the Indian market
# img: assets/img/5.jpg
importance: 2
category: side-projects
---

## Overview

A high-performance options backtesting engine written in C++, specifically optimized for the Indian stock market (Nifty 50 and Bank Nifty). This project enables traders to simulate and validate complex multi-leg options strategies across years of historical tick data in seconds.

## Key Features

- **High-Speed Execution**: Processes 5 years of 1-minute resolution options data across multiple strikes in under 3 seconds using C++ and multi-threading.
- **Multi-Leg Strategies**: Supports straddles, strangles, iron condors, butterflies, and custom defined setups.
- **Slippage and Brokerage Modeling**: Realistic simulation of entry/exit costs, including fixed per-lot brokerage and percentage-based slippage.
- **Margin Calculation**: Implements basic SPAN margin estimation to accurately track return on capital (ROC).
- **Extensible Python API**: Uses `pybind11` to expose the C++ engine to Python, allowing users to define strategies in Python while executing in C++.

## Technology Stack

- **Core Engine**: Modern C++ (C++17)
- **Concurrency**: OpenMP for parallelizing days and strategy sweeps
- **Python Binding**: `pybind11`
- **Data Format**: Optimized binary storage for tick data

## Strategy Example (Python Interface)

```python
from nifty_backtest import Engine, Strategy

# Define a Short Straddle strategy
class ShortStraddle(Strategy):
    def on_tick(self, market_data):
        if market_data.time == "09:20:00":
            atm_strike = market_data.get_atm_strike()
            self.sell_call(atm_strike, quantity=50)
            self.sell_put(atm_strike, quantity=50)

        if market_data.time == "15:15:00":
            self.square_off_all()

# Run the backtest
engine = Engine(data_dir="./data")
results = engine.run(ShortStraddle(), start_date="2020-01-01", end_date="2025-01-01")
print(results.summary())
```
