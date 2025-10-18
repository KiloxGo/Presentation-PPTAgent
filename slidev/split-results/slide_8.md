---
transition: fade-out
---

<div class="absolute inset-0 -z-1" style="border: 2px solid red; overflow: hidden;">
  <img src="/mid.jpg" style="width: 100%; height: 100%; object-fit: fill;">
</div>
# Experimental Setup and Metrics

- **Evaluation Methods**: Turn-based assesses single turns with correct context; session-based assesses multi-turn with error propagation.
- **Cost Metrics**: Include average input tokens and API calls per turn or session.
- **Model Settings**: Used Azure OpenAI APIs with temperature=0, max tokens=2048; open-source models like LLaMa-2 (13B parameters) with zero-shot CoT.
- **Input Handling**: Exceeding token limits led to cutting PPT content, especially affecting open-source LLMs with smaller context windows.
