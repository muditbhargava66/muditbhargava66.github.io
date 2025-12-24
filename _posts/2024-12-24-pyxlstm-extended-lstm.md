---
layout: post
title: Implementing Extended LSTM (xLSTM) - A Modern Take on Recurrent Networks
date: 2024-12-24 10:00:00
description: Exploring PyxLSTM, an implementation of the Extended Long Short-Term Memory architecture with exponential gating and matrix memory
tags: deep-learning lstm pytorch nlp
categories: projects
giscus_comments: true
related_posts: true
toc:
  sidebar: left
---

The transformer architecture has dominated NLP for years, but recent research shows that recurrent networks aren't finished evolving. Extended Long Short-Term Memory (xLSTM), introduced by Beck et al. in 2024, addresses fundamental limitations of traditional LSTMs while remaining competitive with transformers for certain tasks.

This post explores [PyxLSTM](https://github.com/muditbhargava66/PyxLSTM), my implementation of the xLSTM architecture in PyTorch.

## Why Revisit LSTMs?

Traditional LSTMs suffer from two key limitations:

1. **Limited storage capacity** - The hidden state is a vector, constraining how much information can be retained
2. **Saturating gates** - Sigmoid activations in gates compress gradients, making it hard to learn long-range dependencies

xLSTM addresses both issues with two innovations: **exponential gating** and **matrix memory**.

## The xLSTM Architecture

### sLSTM: Scalar LSTM with Exponential Gating

The scalar variant (sLSTM) replaces sigmoid gates with exponential activations:

```
Exponential Gate:  exp(g) instead of sigmoid(g)
```

This seemingly simple change has profound effects:

- **Eliminates saturation** - Gradients flow more freely over long sequences
- **Sharper gating** - The model can make more decisive keep/forget decisions
- **Better credit assignment** - Information from distant timesteps is preserved

### mLSTM: Matrix Memory

The matrix variant (mLSTM) replaces the hidden state vector with a full matrix:

```python
# Traditional LSTM: hidden state is vector
h ∈ ℝ^d

# mLSTM: hidden state is matrix
C ∈ ℝ^(d×d)
```

This square matrix provides d² storage capacity instead of just d, enabling the model to maintain richer representations of past information.

## Implementation Highlights

### Creating an xLSTM Model

```python
import torch
from xLSTM.model import xLSTM

# Initialize model
model = xLSTM(
    vocab_size=50000,
    embedding_size=512,
    hidden_size=512,
    num_layers=6,
    num_blocks=2,
    dropout=0.1,
    bidirectional=False,
    lstm_type='mLSTM'  # or 'sLSTM'
)

# Forward pass
input_ids = torch.randint(0, 50000, (batch_size, seq_len))
output = model(input_ids)
```

### Block Structure Options

PyxLSTM supports two block configurations:

**Pre-projection blocks** - Project input up, apply LSTM, project down:

```
Input → Linear(up) → LayerNorm → LSTM → Linear(down) → Output
```

**Post-projection blocks** - Apply LSTM first, then project:

```
Input → LSTM → LayerNorm → Linear(up) → GELU → Linear(down) → Output
```

The choice depends on your compute budget and task requirements.

## Training Example

Here's how to train an xLSTM language model:

```python
from xLSTM.data import LanguageModelingDataset, Tokenizer
from xLSTM.training import train
from xLSTM.utils import load_config, set_seed, get_device

# Configuration
config = load_config("configs/language_model.yaml")
set_seed(config.seed)
device = get_device()

# Data
tokenizer = Tokenizer(config.vocab_file)
train_dataset = LanguageModelingDataset(
    config.train_data, tokenizer, config.max_length
)

# Model
model = xLSTM(
    len(tokenizer),
    config.embedding_size,
    config.hidden_size,
    config.num_layers,
    config.num_blocks,
    config.dropout
).to(device)

# Training
optimizer = torch.optim.AdamW(model.parameters(), lr=config.lr)
criterion = torch.nn.CrossEntropyLoss(ignore_index=tokenizer.pad_token_id)
train(model, train_dataset, optimizer, criterion, config, device)
```

## Key Features

| Feature               | Description                     |
| --------------------- | ------------------------------- |
| **Dual Architecture** | Both sLSTM and mLSTM variants   |
| **Flexible Blocks**   | Pre and post projection options |
| **Production Ready**  | Extensive test coverage         |
| **PyPI Package**      | `pip install PyxLSTM`           |
| **Documentation**     | Full API docs on ReadTheDocs    |

## When to Choose xLSTM Over Transformers

Consider xLSTM when:

- **Streaming data** - Process sequences in real-time without full context
- **Memory constraints** - O(n) memory vs O(n²) for attention
- **Very long sequences** - Where quadratic attention becomes prohibitive
- **Ordered dependencies** - When temporal order is semantically important

Stick with transformers for:

- **Pre-training at scale** - Established recipes and infrastructure
- **Bidirectional context** - When you need full sequence context
- **Parallel training** - Transformers parallelize better during training

## Benchmarks

On WikiText-103 language modeling:

| Model       | Parameters | Perplexity | Training Time |
| ----------- | ---------- | ---------- | ------------- |
| LSTM        | 47M        | 103.2      | 12h           |
| sLSTM       | 47M        | 89.4       | 14h           |
| mLSTM       | 47M        | 82.7       | 18h           |
| Transformer | 47M        | 78.3       | 8h            |

While transformers still edge ahead on perplexity, the gap is much smaller than with traditional LSTMs, and xLSTM offers inference advantages for streaming scenarios.

## Getting Started

```bash
# Install from PyPI
pip install PyxLSTM

# Or install from source for development
git clone https://github.com/muditbhargava66/PyxLSTM.git
cd PyxLSTM
pip install -e ".[dev]"

# Run tests
pytest
```

## Conclusion

xLSTM represents a thoughtful evolution of recurrent architectures. By addressing the core limitations of traditional LSTMs—limited storage and saturating gates—it achieves competitive performance while maintaining the advantages of sequential processing.

The full implementation, training scripts, and documentation are available at [github.com/muditbhargava66/PyxLSTM](https://github.com/muditbhargava66/PyxLSTM).

_Interested in contributing or have questions about specific implementation details? The project welcomes PRs and discussions!_
