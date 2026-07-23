---
layout: page
title: Superscalar Pipeline Simulator
description: Cycle-accurate C++ simulator for an out-of-order execution, dual-issue superscalar MIPS processor
# img: assets/img/4.jpg
importance: 1
category: systems
related_publications: false
---

## Overview

A cycle-accurate simulator for **superscalar, out-of-order processor pipelines** implementing Tomasulo's algorithm with register renaming, reservation stations, and a reorder buffer. The simulator models the complete microarchitectural pipeline from instruction fetch through retirement, enabling performance analysis and design-space exploration.

## Architecture

The simulator models a configurable superscalar pipeline with:

- **Fetch/Decode**: Configurable fetch width (1–4 instructions/cycle)
- **Issue**: Tomasulo's algorithm with reservation stations per functional unit
- **Execute**: Multiple functional units (ALU, FPU, Load/Store, Branch)
- **Commit**: In-order retirement via reorder buffer (ROB)

### Key Microarchitectural Features

| Feature               | Implementation                  |
| --------------------- | ------------------------------- |
| Issue width           | 1–4 way superscalar             |
| Register renaming     | Physical register file with RAT |
| Branch prediction     | 2-bit saturating counter, BTB   |
| Memory disambiguation | Store buffer with forwarding    |
| ROB size              | Configurable (16–128 entries)   |

## Performance Analysis

The simulator generates detailed statistics:

- **IPC** (Instructions Per Cycle) across benchmark workloads
- **Pipeline utilization** — bubbles, stalls, flushes per stage
- **Branch misprediction rate** and recovery cost
- **Memory access patterns** — hit/miss rates, store-to-load forwarding

## Use Cases

- Computer architecture coursework and research
- Design-space exploration for custom processors
- Performance bottleneck analysis
- Validation of microarchitectural optimizations

## Links

- **Repository**: [github.com/muditbhargava66/Superscalar-Pipeline-Simulator](https://github.com/muditbhargava66/Superscalar-Pipeline-Simulator)
