---
layout: page
title: Open Source DSP Library
description: High-performance digital signal processing library with SIMD optimization
img: assets/img/dsp_library.jpg
importance: 4
category: software
---

## LibDSP: Modern C++ Signal Processing Library

A comprehensive, header-only Digital Signal Processing (DSP) library written in modern C++ with SIMD optimizations for x86 (SSE/AVX) and ARM (NEON) architectures.

## Features

### Core Signal Processing

- **Transforms**: FFT, DCT, Wavelet transforms
- **Filters**: FIR, IIR, Adaptive filters
- **Windows**: Hamming, Hanning, Blackman, Kaiser
- **Spectral Analysis**: PSD, Spectrogram, Cepstrum

### Advanced Algorithms

- **Multirate Processing**: Decimation, Interpolation, Polyphase filters
- **Adaptive Algorithms**: LMS, RLS, NLMS
- **Statistical Processing**: Correlation, Convolution, Hilbert transform
- **Audio Processing**: Pitch detection, MFCC, Audio effects

## Architecture

```cpp
namespace dsp {
    // Example: SIMD-optimized FIR filter
    template<typename T, size_t N>
    class FIRFilter {
    private:
        alignas(32) std::array<T, N> coefficients;
        CircularBuffer<T, N> delay_line;

    public:
        T process(T input) {
            delay_line.push(input);

            #ifdef __AVX2__
                return process_avx2();
            #elif defined(__ARM_NEON)
                return process_neon();
            #else
                return process_scalar();
            #endif
        }

    private:
        T process_avx2() {
            // AVX2 implementation
            __m256 sum = _mm256_setzero_ps();
            for (size_t i = 0; i < N; i += 8) {
                __m256 coef = _mm256_load_ps(&coefficients[i]);
                __m256 data = _mm256_load_ps(&delay_line[i]);
                sum = _mm256_fmadd_ps(coef, data, sum);
            }
            return horizontal_sum(sum);
        }
    };
}
```

## Performance Benchmarks

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/dsp_benchmark_fft.png" title="FFT Performance" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/dsp_benchmark_filter.png" title="Filter Performance" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

### Benchmark Results

| Algorithm   | LibDSP (AVX2) | Intel IPP | FFTW   | Speedup |
| ----------- | ------------- | --------- | ------ | ------- |
| 1024 FFT    | 1.2 μs        | 1.5 μs    | 1.8 μs | 1.5x    |
| 256 FIR     | 0.8 μs        | 1.1 μs    | N/A    | 1.4x    |
| Correlation | 2.1 μs        | 2.8 μs    | N/A    | 1.3x    |

## Usage Examples

### Basic FFT

```cpp
#include <libdsp/transforms.hpp>

// Create FFT object
dsp::FFT<float, 1024> fft;

// Prepare input data
std::array<std::complex<float>, 1024> signal;
generate_sine_wave(signal, 440.0f, 48000.0f);

// Perform FFT
auto spectrum = fft.forward(signal);

// Calculate magnitude spectrum
auto magnitude = dsp::magnitude_spectrum(spectrum);
```

### Real-time Filtering

```cpp
#include <libdsp/filters.hpp>

// Design lowpass filter
auto coeffs = dsp::design_lowpass_fir<float, 64>(
    1000.0f,  // cutoff frequency
    48000.0f, // sample rate
    dsp::Window::KAISER
);

// Create filter
dsp::FIRFilter<float, 64> filter(coeffs);

// Process audio stream
for (auto& sample : audio_buffer) {
    sample = filter.process(sample);
}
```

## Integration with Other Libraries

### Python Bindings

```python
import libdsp

# Create spectrogram analyzer
analyzer = libdsp.Spectrogram(
    window_size=1024,
    hop_size=512,
    window_type='hann'
)

# Analyze audio
spectrogram = analyzer.compute(audio_data)
```

### MATLAB Interface

```matlab
% Load LibDSP MEX functions
addpath('libdsp/matlab');

% Use optimized FFT
spectrum = libdsp_fft(signal);

% Apply adaptive filter
[output, weights] = libdsp_lms(input, desired, mu);
```

## Documentation

Comprehensive documentation with examples available at [libdsp.readthedocs.io](https://libdsp.readthedocs.io)

### API Reference

- [Core Modules](https://libdsp.readthedocs.io/en/latest/api/core.html)
- [Transforms](https://libdsp.readthedocs.io/en/latest/api/transforms.html)
- [Filters](https://libdsp.readthedocs.io/en/latest/api/filters.html)
- [Utilities](https://libdsp.readthedocs.io/en/latest/api/utils.html)

## Contributing

We welcome contributions! See our [contributing guidelines](https://github.com/muditbhargava66/libdsp/blob/main/CONTRIBUTING.md).

### Development Setup

```bash
# Clone repository
git clone https://github.com/muditbhargava66/libdsp.git
cd libdsp

# Build with CMake
mkdir build && cd build
cmake .. -DCMAKE_BUILD_TYPE=Release
make -j8

# Run tests
ctest --verbose
```

## License

MIT License - see [LICENSE](https://github.com/muditbhargava66/libdsp/blob/main/LICENSE) file.

## Citations

If you use LibDSP in your research, please cite:

```bibtex
@software{bhargava2024libdsp,
  author = {Bhargava, Mudit},
  title = {LibDSP: High-Performance Digital Signal Processing Library},
  year = {2024},
  url = {https://github.com/muditbhargava66/libdsp}
}
```
