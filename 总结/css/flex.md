## flex 布局

<pre>
### 概念
    采用 flex 布局的元素 称为 flex 容器 (flex container)
    它的所有子元素自动成为容器成员 称为 flex 项目 (flex item)

### 轴
    容器默认存在两根轴
        水平的主轴 (main axis)
        垂直的交叉轴 (cross axis)

    项目默认沿主轴排列

### 容器拥有的属性
    flex-direction 决定主轴的方向
        可能存在的值
            row: 主轴为水平方向 起点在左端 -- 默认值
            row-reverse: 主轴为水平方向 起点在右端
            column: 主轴为垂直方向 起点在上沿
            column-reverse: 主轴为垂直方向 起点在下沿

    flex-wrap 决定项目一行放不下时如何换行
        可能存在的值
            nowrap: 不换行 -- 默认值
            wrap: 换行 第一行在上方
            wrap-reverse: 换行 第一行在下方

    简写形式
    flex-flow
        flex-direction 属性和 flex-wrap 属性的简写形式

    justify-content 定义项目在主轴上的对齐方式
        可能存在的值
            flex-start: 左对齐
            flex-end: 右对齐
            center: 居中
            space-between: 两端对齐 项目之间的间隔都相等
            space-around: 每个项目两侧的间隔相等

    align-items 定义项目如何在交叉轴上排布
        可能存在的值
            flex-start
            flex-end
            center
            baseline
            stretch

    align-content 多根轴线（多行）的对齐方式

### 子项的属性

    order
    flex-grow 定义项目的放大比例 默认为 0 即不放大
    flex-shrink 定义了项目的缩小比例 默认为 1 即项目将缩小
    flex-basis 定义了在分配多余空间之前，项目占据的主轴空间
    align-self 允许单个项目有与其他项目不一样的对齐方式 可覆盖 align-items 属性

    简写形式
    flex: none | [ <flex-grow> <flex-shrink> || <flex-basis> ]

</pre>
