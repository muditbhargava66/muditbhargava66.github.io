---
layout: page
title: Real-time Audio Processing
description: Low-latency audio effects and synthesis using modern DSP techniques
img: assets/img/audio_processing.jpg
importance: 5
category: software
---

## Overview

This project implements a real-time audio processing framework with various effects and synthesis capabilities. Built with a focus on low latency and high quality, it's suitable for professional audio applications, live performance, and embedded systems.

## Key Features

- **Ultra-low Latency**: < 2ms round-trip latency
- **High Quality**: 32-bit float processing, up to 192 kHz sample rate
- **Modular Architecture**: Chain multiple effects in any order
- **Cross-platform**: Windows, macOS, Linux, and embedded Linux

## Audio Effects Implemented

### Time-Domain Effects

- **Dynamics**: Compressor, Limiter, Gate, Expander
- **Distortion**: Tube emulation, Bit crusher, Wave shaping
- **Modulation**: Chorus, Flanger, Phaser, Ring modulator

### Frequency-Domain Effects

- **EQ**: Parametric, Graphic, Dynamic EQ
- **Filters**: Analog-modeled filters (Moog, Roland)
- **Spectral**: Vocoder, Pitch shifter, Harmonizer

### Spatial Effects

- **Reverb**: Convolution and algorithmic reverb
- **Delay**: Tape delay, Ping-pong, Multi-tap
- **3D Audio**: Binaural processing, Ambisonics

## Technical Implementation

### Audio Engine Architecture

```cpp
class AudioEngine {
private:
    std::vector<std::unique_ptr<AudioEffect>> effects_chain;
    AudioBuffer process_buffer;
    std::atomic<bool> bypass{false};

public:
    void process(float** inputs, float** outputs, int num_samples) {
        // Copy input to process buffer
        process_buffer.copy_from(inputs, num_samples);

        // Process through effects chain
        if (!bypass.load()) {
            for (auto& effect : effects_chain) {
                if (effect->is_enabled()) {
                    effect->process(process_buffer);
                }
            }
        }

        // Copy to output
        process_buffer.copy_to(outputs, num_samples);
    }
};
```

### Example: Vintage Compressor

```cpp
class VintageCompressor : public AudioEffect {
private:
    float threshold_db = -12.0f;
    float ratio = 4.0f;
    float attack_ms = 10.0f;
    float release_ms = 100.0f;
    float knee_width = 2.0f;

    EnvelopeFollower envelope;
    SmoothParameter gain_reduction;

public:
    void process(AudioBuffer& buffer) override {
        for (int ch = 0; ch < buffer.num_channels(); ++ch) {
            float* samples = buffer.channel(ch);

            for (int i = 0; i < buffer.num_samples(); ++i) {
                // Envelope detection
                float env_db = envelope.process(samples[i]);

                // Gain calculation with soft knee
                float gain_db = calculate_gain(env_db);

                // Apply compression
                samples[i] *= db_to_linear(gain_db);
            }
        }
    }
};
```

## Performance Optimization

### SIMD Optimization Example

```cpp
void process_stereo_avx(float* left, float* right, int num_samples) {
    const __m256 threshold = _mm256_set1_ps(threshold_linear);
    const __m256 ratio_inv = _mm256_set1_ps(1.0f / ratio);

    for (int i = 0; i < num_samples; i += 8) {
        // Load samples
        __m256 l = _mm256_load_ps(&left[i]);
        __m256 r = _mm256_load_ps(&right[i]);

        // Calculate stereo linked compression
        __m256 max_lr = _mm256_max_ps(_mm256_abs_ps(l), _mm256_abs_ps(r));

        // Compute gain reduction
        __m256 over = _mm256_max_ps(_mm256_sub_ps(max_lr, threshold),
                                     _mm256_setzero_ps());
        __m256 gain = _mm256_sub_ps(_mm256_setzero_ps(),
                                    _mm256_mul_ps(over, ratio_inv));

        // Apply gain
        l = _mm256_mul_ps(l, db_to_linear_avx(gain));
        r = _mm256_mul_ps(r, db_to_linear_avx(gain));

        // Store results
        _mm256_store_ps(&left[i], l);
        _mm256_store_ps(&right[i], r);
    }
}
```

## GUI Interface

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/audio_gui_main.png" title="Main Interface" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/audio_gui_analyzer.png" title="Spectrum Analyzer" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

## Plugin Formats

The audio processor is available as:

- **VST3**: For use in DAWs
- **AU**: Audio Units for macOS
- **LV2**: Linux plugin format
- **Standalone**: Desktop application
- **Embedded**: Raspberry Pi, BeagleBone

## Benchmarks

| Effect      | CPU Usage | Latency | Quality        |
| ----------- | --------- | ------- | -------------- |
| EQ (8-band) | 0.5%      | 0.1ms   | 64-bit         |
| Compressor  | 0.3%      | 0.05ms  | Analog-modeled |
| Reverb      | 2.1%      | 0.5ms   | True stereo    |
| Pitch Shift | 1.8%      | 5ms     | Phase vocoder  |

## Use Cases

### Live Performance

- Guitar effects processing
- Vocal processing
- DJ effects

### Studio Production

- Mixing console emulation
- Mastering chain
- Virtual instruments

### Broadcast

- Voice processing
- Loudness control
- Audio restoration

## Building from Source

```bash
# Clone repository
git clone https://github.com/muditbhargava66/realtime-audio.git
cd realtime-audio

# Configure build
mkdir build && cd build
cmake -DCMAKE_BUILD_TYPE=Release \
      -DBUILD_VST3=ON \
      -DBUILD_STANDALONE=ON ..

# Build
make -j$(nproc)

# Run tests
./test/audio_tests
```

## Future Development

- Machine learning-based effects
- GPU acceleration for convolution
- Network audio streaming
- Mobile app versions

## License

This project is licensed under GPL v3.
