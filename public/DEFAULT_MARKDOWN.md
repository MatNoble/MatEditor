# 欢迎来到 MatNoble Editor

一个为您量身打造的 **Markdown** 写作环境，注重*沉浸式体验*和*高效创作*。

## 特色功能

我们致力于提供美观与功能兼备的编辑体验。

1.  **精美主题**: 内置多款精心设计的主题，从代码的冷峻到学术的典雅，一键切换。
2.  **数学公式**: 支持 LaTeX，无论是行内公式 $E=mc^2$ 还是复杂的块级公式，都能完美渲染。
3.  **智能辅助**: 集成 AI 写作助手，帮您润色文章、修正语法。
4.  **便捷导出**: 可将您的作品导出为包含样式的独立 HTML 文件。

---

## 数学公式 (LaTeX)

MatNoble Editor 提供强大的 LaTeX 公式渲染支持。无论是行内公式还是复杂的块级公式，都能完美呈现。

### 行内公式

质能方程 $E = mc^2$ 描述了质量与能量之间的关系。

### 块级公式

#### 矩阵示例

$$
\mathbf{A} = \begin{pmatrix}
 a_{11} & a_{12} & \cdots & a_{1n} \\
 a_{21} & a_{22} & \cdots & a_{2n} \\
 \vdots & \vdots & \ddots & \vdots \\
 a_{m1} & a_{m2} & \cdots & a_{mn}
\end{pmatrix}
$$

#### 傅里叶变换

$$
F(\omega) = \frac{1}{2\pi} \int_{-\infty}^{\infty} f(t) e^{-i\omega t} dt
$$

#### 麦克斯韦方程组

$$
\begin{cases}
\nabla \cdot \mathbf{E} = \frac{\rho}{\varepsilon_0} \\
\nabla \cdot \mathbf{B} = 0 \\
\nabla \times \mathbf{E} = -\frac{\partial \mathbf{B}}{\partial t} \\
\nabla \times \mathbf{B} = \mu_0 \mathbf{J} + \mu_0 \varepsilon_0 \frac{\partial \mathbf{E}}{\partial t}
\end{cases}
$$

---

## Markdown 元素展示

### 标题

#### 四级标题 H4
##### 五级标题 H5
###### 六级标题 H6

### 强调

你可以用 **粗体 (bold)** 来突出重点，或者用 *斜体 (italic)* 来强调。
甚至可以同时使用 ***粗斜体 (bold italic)***。
当然，你也可以用 ~~删除线 (strikethrough)~~ 来表示已过时或不重要的内容。

### 列表

#### 无序列表
*   项目一
*   项目二
    *   子项目 2.1
    *   子项目 2.2
*   项目三

#### 有序列表
1.  第一个项目
2.  第二个项目
    1.  子项目 2.1
    2.  子项目 2.2
3.  第三个项目

#### 任务列表
- [x] 完成任务 A
- [ ] 完成任务 B
- [ ] 完成任务 C

### 链接与图片

这是一个 [外部链接](https://blog.matnoble.top)。

![Placeholder Image](https://placehold.co/246x150/0000FF/FFFFFF?text=MatNoble&font=roboto)


### 引用

> 科学不仅是一种理智的训练，更是一种精神的修炼。它教我们如何看待世界，如何尊重事实，如何在不确定性中寻找确定性。
> 
> — — 一位不知名的学者

### 代码

行内代码示例: `const message = "Hello, World!";`

#### 代码块

```javascript
// 使用 ES6 class 定义一个简单的“粒子”
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.history = [{x, y}];
  }

  update() {
    this.x += Math.random() * 2 - 1;
    this.y += Math.random() * 2 - 1;
    this.history.push({x: this.x, y: this.y});
    if (this.history.length > 10) {
      this.history.shift();
    }
  }
}
```

### 表格

| 主题名     | 字体风格 | 主要特色          |
| :--------- | :------- | :---------------- |
| **未来**   | 无衬线体 | 科技感、清晰、现代 |
| **格致**   | 衬线体   | 学术、严谨、复古   |
| **橘颂**   | 无衬线体 | 活力、温暖、醒目   |
| **永夜**   | 等宽字体 | 暗黑、沉浸、代码   |

### 分隔线

---

这是一个分隔线，表示内容的段落划分。

***
