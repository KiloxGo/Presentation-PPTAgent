---
class: px-20
---

<div class="absolute inset-0 -z-1" style="border: 2px solid red; overflow: hidden;">
  <img src="/mid.jpg" style="width: 100%; height: 100%; object-fit: fill;">
</div>
# Challenges and Error Analysis

- **Error Accumulation**: Multi-turn sessions suffer from error propagation, leading to poor session-based accuracy even for strong models.
- **Long Template Handling**: LLMs struggle with long PPT templates, with GPT-4 achieving only 38.1% turn-based accuracy in editing tasks.
- **Multi-modality Issues**: GPT-4 performs poorly in non-text modalities, especially position-related instructions (24% accuracy), and picture operations (56% accuracy).
- **Common Errors**: Include position errors, API hallucination, misunderstanding PPT content, and unfollowing task rules.
