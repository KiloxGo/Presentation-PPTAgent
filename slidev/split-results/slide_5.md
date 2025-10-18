---
transition: slide-up
---

<div class="absolute inset-0 -z-1" style="border: 2px solid red; overflow: hidden;">
  <img src="/mid.jpg" style="width: 100%; height: 100%; object-fit: fill;">
</div>
# Performance of LLMs on PPTC

- **Model Testing**: Evaluated 3 closed-source and 6 open-source LLMs, with GPT-4 leading in performance.
- **GPT-4 Results**: Achieves 75.1% turn-based accuracy in creating new PPT files but only 22.7% session-based accuracy due to error accumulation.
- **Open-Source LLMs**: Underperform compared to closed-source models, with LLaMa-2-chat at 16.2% accuracy, but show potential with code pre-training.
- **Resource Usage**: GPT-4 has lower API costs but highest token expense in editing tasks; session-based methods generally require more tokens and API calls.
