---
layout: page
title: Neural Network Accelerator
description: Custom FPGA-based hardware accelerator for deep learning inference
img: assets/img/nn_accelerator.jpg
importance: 6
category: hardware
---

## Project Overview

This project presents a custom hardware accelerator designed specifically for efficient deep neural network inference on FPGAs. The accelerator achieves high throughput and energy efficiency through specialized compute units, optimized memory hierarchies, and intelligent dataflow architectures.

## Architecture

### System Overview

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/nn_arch_overview.png" title="Accelerator Architecture" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

### Key Components

1. **Processing Elements (PEs)**
   - Systolic array architecture
   - 256 MAC units per PE
   - INT8/INT16 precision support
   - Peak performance: 2 TOPS

2. **Memory Hierarchy**
   - On-chip SRAM: 4 MB
   - DDR4 interface: 25.6 GB/s
   - Weight compression: 4:1 ratio
   - Activation sparsity exploitation

3. **Control Unit**
   - RISC-V based controller
   - DMA engines for data movement
   - Hardware scheduling optimization

## Supported Operations

### Core Layers

- Convolution (including depthwise/pointwise)
- Fully connected layers
- Pooling (max, average, global)
- Batch normalization (fused)
- Activation functions (ReLU, Sigmoid, Tanh)

### Advanced Features

- Skip connections
- Element-wise operations
- Dynamic shape support
- Multi-branch networks

## Implementation Details

### Convolution Engine

```verilog
module conv_engine #(
    parameter PE_ROWS = 16,
    parameter PE_COLS = 16,
    parameter DATA_WIDTH = 8
)(
    input clk,
    input rst_n,
    input [DATA_WIDTH-1:0] input_data,
    input [DATA_WIDTH-1:0] weight_data,
    output [DATA_WIDTH*2-1:0] output_data
);

    // Systolic array for matrix multiplication
    genvar i, j;
    generate
        for (i = 0; i < PE_ROWS; i = i + 1) begin : row
            for (j = 0; j < PE_COLS; j = j + 1) begin : col
                processing_element #(
                    .DATA_WIDTH(DATA_WIDTH)
                ) pe (
                    .clk(clk),
                    .rst_n(rst_n),
                    .a_in(row_data[i]),
                    .b_in(col_data[j]),
                    .c_in(partial_sum[i][j]),
                    .c_out(partial_sum[i][j+1])
                );
            end
        end
    endgenerate
endmodule
```

### Dataflow Optimization

```python
# Compiler optimization for layer fusion
def optimize_graph(model):
    """Fuse operations to minimize memory transfers"""
    optimized = []

    for i, layer in enumerate(model.layers):
        if can_fuse(layer, model.layers[i+1]):
            fused = fuse_layers(layer, model.layers[i+1])
            optimized.append(fused)
            i += 1  # Skip next layer
        else:
            optimized.append(layer)

    return optimized
```

## Performance Results

### Benchmark Networks

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        <table class="table table-hover">
            <thead>
                <tr>
                    <th>Network</th>
                    <th>FPS</th>
                    <th>Latency</th>
                    <th>Power</th>
                    <th>Efficiency</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>ResNet-50</td>
                    <td>312</td>
                    <td>3.2 ms</td>
                    <td>8.5 W</td>
                    <td>235 GOPS/W</td>
                </tr>
                <tr>
                    <td>MobileNet-V2</td>
                    <td>1840</td>
                    <td>0.54 ms</td>
                    <td>4.2 W</td>
                    <td>380 GOPS/W</td>
                </tr>
                <tr>
                    <td>YOLO-V3 Tiny</td>
                    <td>125</td>
                    <td>8.0 ms</td>
                    <td>12.3 W</td>
                    <td>162 GOPS/W</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

### Comparison with Other Platforms

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/performance_comparison.png" title="Performance Comparison" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/efficiency_comparison.png" title="Energy Efficiency" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

## Software Stack

### Compiler Toolchain

```bash
# Model compilation workflow
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   ONNX Model    │ --> │  Quantization   │ --> │  Graph Optimizer│
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                          │
                                                          v
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  FPGA Bitstream │ <-- │  Place & Route  │ <-- │  HLS Generation │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Runtime API

```cpp
// C++ API for inference
class NNAccelerator {
public:
    // Load compiled model
    void load_model(const std::string& model_path);

    // Synchronous inference
    Tensor infer(const Tensor& input);

    // Asynchronous inference with callback
    void infer_async(const Tensor& input,
                     std::function<void(Tensor)> callback);

    // Batch inference for higher throughput
    std::vector<Tensor> infer_batch(const std::vector<Tensor>& inputs);

    // Performance profiling
    ProfileData get_profile_data();
};
```

## Applications

### Computer Vision

- Real-time object detection
- Image segmentation
- Face recognition
- Video analytics

### Edge AI

- Autonomous vehicles
- Drone navigation
- Smart cameras
- Industrial inspection

### Healthcare

- Medical image analysis
- Real-time patient monitoring
- Diagnostic assistance

## Resource Utilization

**Target Device**: Xilinx ZCU104 (Zynq UltraScale+ MPSoC)

| Resource | Used    | Available | Utilization |
| -------- | ------- | --------- | ----------- |
| LUTs     | 168,432 | 230,400   | 73%         |
| FFs      | 201,984 | 460,800   | 44%         |
| BRAM     | 280     | 312       | 90%         |
| DSP48    | 1,248   | 1,728     | 72%         |

## Future Enhancements

1. **Sparse Computing**: Hardware support for sparse matrices
2. **Mixed Precision**: FP16 and INT4 support
3. **Transformer Support**: Specialized attention mechanisms
4. **Multi-FPGA Scaling**: Distributed inference

## Publications

1. "Energy-Efficient Neural Network Accelerator with Systolic Array Architecture" - _Submitted to FPGA 2024_
2. "Optimizing Memory Access Patterns in FPGA-based DNN Accelerators" - _Workshop Paper, ISCA 2023_

## Open Source Release

The project will be open-sourced after publication. Stay tuned!

- HDL sources
- Compiler toolchain
- Pre-trained models
- Benchmark suite

## Acknowledgments

This work was inspired by various academic and industry accelerators including Google's TPU, NVIDIA's DLA, and Microsoft's Brainwave.
