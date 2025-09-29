---
title: "Grounding Natural Language to SQL Translation with Data-Based Self-Explanations" 
venue: "ICDE 2025"
date: 2025-05-12
lastmod: 2025-05-13
tags: ["Natural Language Interface","Text-to-SQL", "Feedback Loop", "Self-Explanations"]
author: ["Yuankai Fan*", "Tonghui Ren", "Can Huang", "Zhenying He", "X. Sean Wang"]

description: "" 
summary: "We propose an iterative framework designed for end-to-end nl2sql translation models to autonomously generate the best output through self-evaluation."
cover:
    image: "paper1.png"
    alt: "Abstract Models for Planning"
    relative: false
editPost:
    URL: "https://ieee-icde.org/2025/"
    Text: "ICDE 2025"

---

---

##### Download

+ [Paper](paper1.pdf)
<!-- + [Code and data](https://github.com/pmichaillat/feru) -->

---

##### Abstract

Natural Language Interfaces for Databases em-power non-technical users to interact with data using natural language (NL). Advanced approaches, utilizing either neural sequence-to-sequence or more recent sophisticated large-scale language models, typically implement NL to SQL (NL2SQL) translation in an end-to-end fashion. However, like humans, these end-to-end translation models may not always generate the best SQL output on their first try. In this paper, we propose Cyclesql, an iterative framework designed for end-to-end translation models to autonomously generate the best output through self-evaluation. The main idea of CyClesql is to introduce data-grounded NL explanations of query results as self-provided feedback, and use the feedback to validate the correctness of the translation iteratively, hence improving the overall translation accuracy. Extensive experiments, including quantitative and qualitative evaluations, are conducted to study Cyclesql by applying it to seven existing translation models on five widely used benchmarks. The results show that 1) the feedback loop introduced in Cyclesql can consistently improve the performance of existing models, and in particular, by applying Cyclesql to Resdsql, obtains a translation accuracy of 82.0% (+2.6%) on the validation set, and 81.6 % (+3.2%) on the test set of Spider benchmark; 2) the generated NL explanations can also provide insightful information for users, aiding in the comprehension of translation results and consequently enhancing the interpretability of NL2SQL translation.

---

##### Figure 3: Overview framework of CycleSQL

![](paper1.png)

---

##### Citation

Fan Y., Ren T., Huang C., He Z., Wang X.S. (2025) "Grounding Natural Language to SQL Translation with Data-Based Self-Explanations", *International Conference on Data Engineering* pages 29-42.

```BibTeX
@article{cyclesql2025,
author = {Yuankai Fan, Tonghui Ren, Can Huang, Zhenying He and X. Sean Wang},
year = {2025},
title ={Grounding Natural Language to SQL Translation with Data-Based Self-Explanations},
journal = {International Conference on Data Engineering},
pages = {29-42}}
```

---

##### Related material

+ [Presentation slides](presentation1.pdf)
<!-- + [Summary of the paper](https://www.penguinrandomhouse.com/books/110403/unusual-uses-for-olive-oil-by-alexander-mccall-smith/) -->
