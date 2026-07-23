---
layout: page
title: FraudShield
description: Real-time fraud detection pipeline for financial transactions using stream processing and ML
# img: assets/img/6.jpg
importance: 3
category: side-projects
related_publications: false
---

## Overview

**FraudShield** is an end-to-end fraud detection pipeline combining ensemble machine learning models with real-time transaction scoring. The system processes financial transaction streams, identifies anomalous patterns, and provides explainable predictions to support human decision-making.

## Architecture

- **Feature engineering**: Temporal aggregations, velocity checks, device fingerprinting features
- **Model ensemble**: Gradient boosted trees (XGBoost) + isolation forest for anomaly detection
- **Explainability**: SHAP-based feature attribution for every prediction
- **Real-time scoring**: Sub-100ms inference latency per transaction

## Performance

| Metric             | Value  |
| ------------------ | ------ |
| AUC-ROC            | 0.97   |
| Precision @ 1% FPR | 0.82   |
| Inference latency  | < 50ms |

## Links

- **Repository**: [github.com/muditbhargava66/FraudShield](https://github.com/muditbhargava66/FraudShield)
