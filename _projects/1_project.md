---
layout: page
title: Open-Crypto-HDL
description: Production-grade cryptographic RTL library with formal verification — AES-256-GCM, ChaCha20-Poly1305, DES/3DES
# img: assets/img/1.jpg
importance: 1
category: hardware-security
related_publications: false
---

## Overview

**open-crypto-hdl** is an open-source, production-grade cryptographic hardware library implementing industry-standard ciphers in synthesizable Verilog/SystemVerilog. Every module ships with a full formal verification suite (SymbiYosys) and simulation testbenches (cocotb), targeting both FPGA prototyping and ASIC tapeout via the TinyTapeout/sky130A flow.

## Implemented Ciphers

| Cipher            | Standard        | Key Sizes       | Status   |
| ----------------- | --------------- | --------------- | -------- |
| AES-256-GCM       | NIST SP 800-38D | 128/192/256-bit | Verified |
| ChaCha20-Poly1305 | RFC 8439        | 256-bit         | Verified |
| DES / 3DES        | FIPS 46-3       | 56/168-bit      | Verified |

## Architecture

The library follows a consistent interface pattern across all cipher implementations:

- **AXI4-Stream compatible** data interfaces for seamless SoC integration
- **FuseSoC** build system for reproducible builds across toolchains
- **Parameterized designs** — configurable pipeline depth, key width, and throughput vs. area tradeoffs
- **Constant-time implementations** to resist timing side-channel attacks

## Verification Methodology

### Formal Verification (SymbiYosys)

- Bounded model checking for all state machines
- Safety properties: no illegal state transitions, key material never exposed on data ports
- Liveness properties: every valid input eventually produces output

### Simulation Testing (cocotb)

- NIST Known Answer Tests (KATs) for each cipher
- Randomized testing with reference Python implementations
- Corner cases: back-to-back operations, key changes mid-stream, reset recovery

## ASIC Target

The library includes a TinyTapeout-compatible wrapper targeting the **sky130A** process:

```
Synthesis results (sky130A, typical corner):
  - AES-256-GCM core: ~12,000 standard cells
  - Max frequency: ~150 MHz
  - Power: ~8 mW @ 100 MHz
```

## Links

- **Repository**: [github.com/muditbhargava66/open-crypto-hdl](https://github.com/muditbhargava66/open-crypto-hdl)
- **Build system**: FuseSoC — `fusesoc run --target=lint open-crypto-hdl`
- **CI**: GitHub Actions — formal verification + simulation on every push
