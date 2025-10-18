---
css: custom.css
theme: seriph
title: PPTC Benchmark Evaluation
info: |
  ## PPTC Benchmark: Evaluating LLMs on PowerPoint Tasks
  A comprehensive benchmark for assessing LLM capabilities in complex multi-modal environments.
class: text-center
transition: slide-left
mdc: true
---
<div class="absolute inset-0 -z-1" style="border: 2px solid red; overflow: hidden;">
  <img src="/first.jpg" style="width: 100%; height: 100%; object-fit: fill;">
</div>
# Introduction to PPTC Benchmark

- **PPTC Benchmark Overview**: Designed to evaluate LLMs' ability to create and edit PowerPoint files from user instructions in a complex multi-modal environment.
- **Gap in Existing Evaluations**: Current LLM evaluations focus on basic tasks and API translation, lacking assessment in complex tool use for multi-turn, multi-modal instructions.
- **Benchmark Composition**: Includes 279 multi-turn sessions with diverse topics and multi-modal operations, addressing the current gap.
- **Evaluation System**: Proposal of PPTX-Match Evaluation System that assesses LLMs based on output files rather than API sequences, supporting varied LLM-generated actions.

---
transition: fade-out
---
<div class="absolute inset-0 -z-1" style="border: 2px solid red; overflow: hidden;">
  <img src="/mid.jpg" style="width: 100%; height: 100%; object-fit: fill;">
</div>
# Why PowerPoint for Benchmarking?

- **Rich Element Diversity**: PowerPoint chosen for its diverse elements and broader API support compared to Word and Excel.
- **Simulated User Interactions**: PPTC features multi-turn dialogues with varying difficulty, simulating real user-LLM interactions.
- **Session Structure**: Each session includes 2 to 17 turns, with instructions derived from actual PowerPoint usage to ensure practicality.

---
transition: slide-up
level: 2
---
<div class="absolute inset-0 -z-1" style="border: 2px solid red; overflow: hidden;">
  <img src="/mid.jpg" style="width: 100%; height: 100%; object-fit: fill;">
</div>
# Benchmark Design and Data Collection

- **Instruction Creation**: Six skilled crowd workers, experienced in PowerPoint, create instructions based on principles like topic consistency and practicability.
- **Multi-modal Coverage**: Sessions avoid single-modality operations to achieve diverse multimodal coverage, including text, image, and position-related APIs.
- **Quality Assurance**: Principal engineer reviews and refines instructions; authors validate data quality for clarity, relevance, and context alignment.
- **Labeled Files**: Workers create labeled PPT files using provided API sequences, with errors reported for revision.

---
layout: two-cols
layoutClass: gap-16
---
<div class="absolute inset-0 -z-1" style="border: 2px solid red; overflow: hidden;">
  <img src="/mid.jpg" style="width: 100%; height: 100%; object-fit: fill;">
</div>
# Evaluation Methodology: PPTX-Match System

- **Content Extraction**: Uses Python-PPTX to iterate over shapes in prediction and label PPT files, extracting attributes like text, style, and position.
- **Attribute Comparison**: Non-position attributes converted to strings and compared using Exact Match; position attributes checked against labeled relations.
- **Success Criteria**: Instruction completion requires no incorrect non-position matches and no position rule violations.
- **Accuracy Metrics**: Turn-based accuracy measures single turns; session-based accuracy measures entire sessions, accounting for error accumulation.

::right::

![](D:/profile/prp/pdf_test/benchmark/images/c2cb45546949319d798360aa5ad7cb4bf96c3f414820a89e98bd3cf925e343bb.jpg)

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

---
layout: image-right
---
<div class="absolute inset-0 -z-1" style="border: 2px solid red; overflow: hidden;">
  <img src="/mid.jpg" style="width: 100%; height: 100%; object-fit: fill;">
</div>
# Algorithms for Performance Enhancement

- **Planning Algorithms**: Zero-shot-CoT and Tree of Thoughts (ToT) boost GPT-4's turn-based performance by 1-2%, but offer minimal gains in session-based evaluations.
- **Selection Algorithms**: Content and API selection improve GPT-4's turn-based performance by 1-5% by filtering irrelevant inputs and reducing token costs.
- **Limitations**: Current planning algorithms often fail in multi-turn sessions and can worsen performance due to error propagation.

![](D:/profile/prp/pdf_test/benchmark/images/f3733e6841f6677f6886b37b35d042065fc0f0da73ae4cfb8fb4b143485774df.jpg)

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

---
level: 2
---
<div class="absolute inset-0 -z-1" style="border: 2px solid red; overflow: hidden;">
  <img src="/mid.jpg" style="width: 100%; height: 100%; object-fit: fill;">
</div>
# Results and Model Comparisons

- **GPT-4 Superiority**: Leads in both creating new PPT (75.1% turn-based, 22.7% session-based) and editing templates (38.1% turn-based, 6.0% session-based).
- **Open-Source Performance**: Code-LLaMa improves LLaMa-2's accuracy by 20.4% in PPT creation, showing benefits of code pre-training.
- **Modality-Specific Accuracy**: GPT-4 excels in text (85.6%) but struggles with charts and tables (lower by 12.4% and 16.2%).

![](D:/profile/prp/pdf_test/benchmark/images/c2cb45546949319d798360aa5ad7cb4bf96c3f414820a89e98bd3cf925e343bb.jpg)

---
layout: two-cols
---
<div class="absolute inset-0 -z-1" style="border: 2px solid red; overflow: hidden;">
  <img src="/mid.jpg" style="width: 100%; height: 100%; object-fit: fill;">
</div>
# Error Types and Session Challenges

- **Error Categories**: Position errors, calling unavailable APIs, misunderstanding content, and rule violations are common.
- **Session-Specific Issues**: LLMs repeat errors in subsequent turns, and session-based accuracy remains low, near zero for editing tasks.
- **Model Size Impact**: Larger models (e.g., LLaMa-2 70B) show higher turn-based accuracy but no clear correlation with session-based performance.

::right::

![](D:/profile/prp/pdf_test/benchmark/images/f3733e6841f6677f6886b37b35d042065fc0f0da73ae4cfb8fb4b143485774df.jpg)

---
transition: slide-up
---
<div class="absolute inset-0 -z-1" style="border: 2px solid red; overflow: hidden;">
  <img src="/mid.jpg" style="width: 100%; height: 100%; object-fit: fill;">
</div>
# API Reference and Operations

- **API Overview**: 49 feasible APIs for slide management, element selection, text and style modification, shape insertion, and chart operations.
- **Key APIs**: Include choose APIs for element selection before editing, insert APIs for adding content, and set APIs for attributes like color and size.
- **Multi-modal Support**: APIs cover text, images, tables, charts, and shapes, requiring LLMs to understand and utilize multi-modal content.

![](D:/profile/prp/pdf_test/benchmark/images/8c64ec673b24b6a6d6f0820caa3484f0c971115598fc6bbdc9d741077ba56513.jpg)

---
class: text-center
---
<div class="absolute inset-0 -z-1" style="border: 2px solid red; overflow: hidden;">
  <img src="/mid.jpg" style="width: 100%; height: 100%; object-fit: fill;">
</div>
# Limitations and Future Work

- **Current Constraints**: Excludes instructions involving subjective evaluation or non-API operations (e.g., mouse dragging).
- **Future Directions**: May involve large multimodal models for on-screen content understanding and API implementation via keyboard/mouse.
- **Benchmark Availability**: Data, code, and evaluation system released to support research in LLM and agent systems.

![](D:/profile/prp/pdf_test/benchmark/images/55f3d3a344bacee954cf4c1b1a3d4980f50702f65879d59eabc2e5ebfcc0c96c.jpg)

---
layout: center
class: text-center
---
<div class="absolute inset-0 -z-1" style="border: 2px solid red; overflow: hidden;">
  <img src="/last.jpg" style="width: 100%; height: 100%; object-fit: fill;">
</div>
# Conclusion and Implications

- **Benchmark Contribution**: PPTC fills a gap in evaluating LLMs for complex, multi-modal tool use in PowerPoint tasks.
- **Performance Insights**: GPT-4 leads but struggles with multi-turn sessions and multi-modality, highlighting areas for improvement.
- **Research Support**: Released resources aim to foster advancements in LLM capabilities for practical applications.

<PoweredBySlidev mt-10 />