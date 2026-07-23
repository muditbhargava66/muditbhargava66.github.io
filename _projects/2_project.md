---
layout: page
title: JTAG TAP Controller — Formal Verification
description: Full 16-state SVA property proofs via SymbiYosys for an IEEE 1149.1-compliant TAP controller
# img: assets/img/2.jpg
importance: 2
category: hardware-security
related_publications: false
---

## Overview

A complete IEEE 1149.1 JTAG **Test Access Port (TAP) controller** implementation with a comprehensive formal verification suite. The project demonstrates how SystemVerilog Assertions (SVA) and SymbiYosys bounded model checking can provide exhaustive verification of a protocol state machine — proving properties that simulation alone cannot guarantee.

## The 16-State TAP State Machine

The TAP controller implements the full IEEE 1149.1 state machine:

```
Test-Logic-Reset
    │
    └── Run-Test/Idle
         ├── Select-DR-Scan ──── Select-IR-Scan
         │    │                       │
         │    ├── Capture-DR         ├── Capture-IR
         │    ├── Shift-DR           ├── Shift-IR
         │    ├── Exit1-DR           ├── Exit1-IR
         │    ├── Pause-DR           ├── Pause-IR
         │    ├── Exit2-DR           ├── Exit2-IR
         │    └── Update-DR          └── Update-IR
```

## SVA Property Suite

The verification suite includes **40+ SystemVerilog Assertions** covering:

### Safety Properties

- **No illegal transitions**: Every state transition follows the IEEE 1149.1 specification
- **Reset reachability**: `Test-Logic-Reset` is reachable from any state within 5 TMS=1 cycles
- **Mutual exclusivity**: Only one state is active at any time
- **Output correctness**: TDO is driven only during Shift-DR and Shift-IR states

### Liveness Properties

- **Progress**: The controller never deadlocks — it always advances on TCK edges
- **Scan completion**: Every scan sequence that enters Capture-xR eventually reaches Update-xR

### Cover Properties

- Full state reachability — every state is reachable from reset
- All valid 2-state transition pairs exercised

## SymbiYosys Integration

```bash
# Run bounded model checking (depth 30)
sby -f jtag_tap.sby bmc

# Run k-induction proof
sby -f jtag_tap.sby prove

# Generate coverage traces
sby -f jtag_tap.sby cover
```

All 40+ properties pass BMC to depth 30 and k-induction proof. The cover task generates witness traces for every reachable state.

## v2.1.0 Release Highlights

- Fixed edge-case in Pause-DR → Exit2-DR transition timing
- Added parameterized instruction register width
- Improved cocotb testbench coverage to 98%+ line coverage

## Links

- **Repository**: [github.com/muditbhargava66/JTAG-1500-1687-Network-Design-and-Verification](https://github.com/muditbhargava66/JTAG-1500-1687-Network-Design-and-Verification)
