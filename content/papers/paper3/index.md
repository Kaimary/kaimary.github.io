---
title: "MetaSQL: A Generate-then-Rank Framework for Natural Language to SQL Translation" 
venue: "ICDE 2024"
date: 2024-07-23
lastmod: 2024-07-23
tags: ["Natural Language Interface", "NL2SQL", "Learning-to-Rank"]
author: ["Yuankai Fan", "Zhenying He", "Tonghui Ren", "Can Huang", "Yinan Jing", "Kai Zhang", "X. Sean Wang"]
description: "" 
summary: "We propose a unified generate-then-rank framework that can be flexibly incorporated with existing NLIDBs to consistently improve their translation accuracy."
cover:
    image: "paper3.png"
    alt: "Abstract Models for Planning"
    relative: false
editPost:
    URL: "https://www.sciencedirect.com/journal/knowledge-based-systems"
    Text: "ICDE 2024"

---

---

##### Download

+ [Paper](paper3.pdf)
<!-- + [Code and data](https://github.com/pmichaillat/feru) -->

---

##### Abstract

The Natural Language Interface to Databases (NLIDB) empowers non-technical users with database access through intuitive natural language (NL) interactions. Advanced approaches, utilizing neural sequence-to-sequence models or large-scale language models, typically employ auto-regressive decoding to generate unique SQL queries sequentially. While these translation models have greatly improved the overall translation accuracy, surpassing 70% on NLIDB benchmarks, the use of auto-regressive decoding to generate single SQL queries may result in sub-optimal outputs, potentially leading to erroneous translations. In this paper, we propose MetaSQL, a unified generate-then-rank framework that can be flexibly incorporated with existing NLIDBs to consistently improve their translation accuracy. MetaSQL introduces query metadata to control the generation of better SQL query candidates and uses learning-to-rank algorithms to retrieve globally optimized queries. Specifically, MetaSQL first breaks down the meaning of the given NL query into a set of possible query metadata, representing the basic concepts of the semantics. These metadata are then used as language constraints to steer the underlying translation model toward generating a set of candidate SQL queries. Finally, MetaSQL ranks the candidates to identify the best matching one for the given NL query. Extensive experiments are performed to study MetaSQL on two public NLIDB benchmarks. The results show that the performance of the translation models can be effectively improved using MetaSQL. In particular, applying MetaSQL to the published Lgesql model obtains a translation accuracy of 77.4% on the validation set and 72.3 % on the test set of the Spider benchmark, outperforming the baseline by 2.3% and 0.3%, respectively. Moreover, applying MetaSQL to GpT-4 achieves translation accuracies of 68.6%, 42.0%, and 17.6% on the three real-world complex scientific databases of Sciencebenchmark, respectively.

---

##### Figure 2: Overview of MetaSQL

![](paper3.png)

---

##### Citation

Fan Y., He Z., Ren T., Huang C., Jing Y., Zhang K., Wang X.S. (2024) "MetaSQL: A Generate-then-Rank Framework for Natural Language to SQL Translation", *International Conference on Data Engineering* pages 1765--1778.

```BibTeX
@article{metasql2024,
author = {Yuankai Fan, Zhenying He, Tonghui Ren, Can Huang, Yinan Jing, Kai Zhang and X. Sean Wang},
year = {2024},
title ={MetaSQL: A Generate-then-Rank Framework for Natural Language to SQL Translation},
journal = {International Conference on Data Engineering},
pages = {1765--1778}}
```

---

##### Related material

+ [Presentation slides](presentation3.pdf)
+ [Presentation Video](https://youtu.be/uOZEY85Pdlg)
