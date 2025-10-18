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
