---
css: custom.css
theme: seriph
background: https://cover.sli.dev
title: PPTAGENT Framework
info: |
## PPTAGENT: Two-Stage Presentation Generation
class: text-center
transition: slide-left
mdc: 1
---


# PPTAGENT: 基于编辑的两阶段演示文稿生成框架


---
layout: cover
---

# 演示文稿智能生成系统研究

<div class="text-sm">
基于大语言模型的多模态演示文稿自动生成方法
</div>

---

# 研究背景与挑战

<img src="D:/profile/prp/pdf_test/images/24ffd48c91e3abbe9e5c682558268aadf7f4e2c32e6032ae6307d4a84590819a.jpg" class="w-80 mx-auto">

- 演示文稿因其视觉效果好、能有效吸引和沟通受众而被广泛使用
- 制作高质量演示文稿需要引人入胜的故事线、精心设计的版面和丰富内容
- 现有方法主要孤立地改进内容质量，忽略了视觉吸引力和结构连贯性
- 演示文稿的布局和模态复杂性导致LLM难以直接确定应引用哪些幻灯片

---


# PPTAGENT框架概述

- 采用两阶段、基于编辑的方法模拟人类工作流程：
  1. 分析参考演示文稿提取幻灯片级功能类型和内容模式
  2. 起草大纲并迭代生成编辑动作创建新幻灯片
- 关键创新：
  - 幻灯片聚类和模式提取技术
  - 基于HTML渲染的编辑API
  - 自校正机制确保生成鲁棒性


---


# 技术实现细节

<div grid="~ cols-2 gap-4">
<div>

- 幻灯片分类：
  - 结构性幻灯片（开场/过渡/结束页）
  - 内容幻灯片（要点/图表/示例等）
- 层次聚类算法分析布局相似性（ViT嵌入+余弦相似度）
- 编辑API功能：
  - 删除/替换文本和图片元素
  - 复制段落
  - 保持参考幻灯片设计布局

</div>
<div>

<img src="D:/profile/prp/pdf_test/images/b89d2ab376fb54bd1b3220aadcd76e1896db2960a8e37f90cdc554fc4c9040fc.jpg" class="w-full">

</div>
</div>


---


# PPTEVAL评估框架

<img src="D:/profile/prp/pdf_test/images/e4dace8403e46eafd63c619bffc396becf4ba8a9a3a344c74248fdf9396f0776.jpg" class="w-100 mx-auto">

- 三维度评估标准：
  1. 内容质量（信息量、语言清晰度）
  2. 设计效果（色彩、布局、视觉元素）
  3. 连贯性（逻辑结构、背景信息）
- 5分制评分标准（1=差，5=优秀）
- 与人类评估相关性达0.71（皮尔逊系数）


---

# 实验与结果分析

<img src="D:/profile/prp/pdf_test/images/1e7ae388d26894acc2be07dda702cf25d64363c36712d292fd6a2f344f348e76.jpg" class="w-80 mx-auto">

- 数据集：Zenodo10K（10,448份多领域演示文稿）
- 基线对比：
  - 基于规则的DocPres
  - 基于模板的KCTV
- 主要发现：
  - 设计维度提升40.9%（vs DocPres）
  - 连贯性提升36.6%（vs KCTV）
  - 平均得分3.67（满分5分）


---


# 关键优势与创新

<img src="D:/profile/prp/pdf_test/images/546ffc4553bf900f66756866fa2953699477d615860e902b34fab15f26f97361.jpg" class="w-80 mx-auto">

- 突破传统"文本到幻灯片"范式
- 首次实现无参考条件下的设计评估
- 开源代码和数据集（PPTAGENT+PPTEVAL+Zenodo10K）
- 消融实验验证：
  - 大纲模块对连贯性至关重要（+1.12分）
  - 代码渲染提升成功率20.4%


---


# 局限性与未来工作

<img src="D:/profile/prp/pdf_test/images/9921599d884440b4d7a8a20a0f7fabc20cb347bdc078d90d1632830a48fbfcc8.jpg" class="w-80 mx-auto">

- 当前5%的生成失败率
- 参考演示质量影响输出结果
- 布局优化空间（元素重叠问题）
- 未来方向：
  - 减少参考依赖
  - 增强视觉信息整合
  - 提升系统鲁棒性


---
layout: center
class: text-center
---


# 感谢聆听

欢迎提问与讨论
