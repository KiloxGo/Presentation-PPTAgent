---
css: custom.css
theme: seriph
title: PPTC Benchmark Evaluation
info: |
## PPTC Benchmark: Evaluating LLMs on PowerPoint Tasks
class: text-center
transition: slide-left
mdc: 1
---

<div class="absolute inset-0 -z-1" style="border: 2px solid red; overflow: hidden;">
  <img src="/first.jpg" style="width: 100%; height: 100%; object-fit: fill;">
</div>
# Introduction to PPTC Benchmark

- **PPTC Benchmark Overview**: Designed to evaluate LLMs' ability to create and edit PowerPoint files from user instructions in a complex multi-modal environment.
- **Gap in Existing Evaluations**: Current LLM evaluations focus on basic tasks and API translation, lacking assessment in complex tool use for multi-turn, multi-modal instructions.
- **Benchmark Composition**: Includes 279 multi-turn sessions with diverse topics and multi-modal operations, addressing the current gap.
- **Evaluation System**: Proposal of PPTX-Match Evaluation System that assesses LLMs based on output files rather than API sequences, supporting varied LLM-generated actions.
