###### 响应式布局

<pre>
媒体查询
    媒体查询规则
        @media [not|only]? media_type and (media_feature) { css }
    
        media_type
            all  -- 所有设备
            screen  -- 电脑屏幕
            
        media_feature
            [max\-|min\-]?width
            [max\-|min\-]?height
            [max\-|min\-]?device-width
            [max\-|min\-]?device-height
            orientation
</pre>

###### 背景

<pre>
background-attachment: scroll | fixed;
    以下说的容器非 body
    取值为 scroll 的时候 背景位置和它所在的容器有关 ( 随容器定位 ) 背景随浏览器滚动条滚动
    取值为 fixed 的时候 背景位置和它所在的容器无关 ( 随浏览器定位 ) 背景不随浏览器滚动条滚动
    不管取什么值 背景都不随其容器滚动条滚动
</pre>	

###### 字体
<pre>
1. 声明字体
    @font-face {props}

    props
        font-family: '自定义字体名';
        src: url(...);  -- 字体文件地址
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;

2. 使用字体
    font-family: '自定义字体名';
</pre>

###### 动画
<pre>
1. 定义动画
    语法
        @keyframes 动画名 { 时间段样式规则 }

2. 使用动画
    语法
        animation: animation-name animation-duration animation-timing-function animation-iteration-count
    分开语法
        animation-name: 定义的动画名[,第二个动画名]
        animation-duration: time;  /* 动画持续时间 */
        animation-timing-function: ease | linear | ease-in | ease-out | ease-in-out | cubic-bezier | steps; /* 动画的播放方式 */
        animation-delay: time;  /* 动画延迟时间 */
        animation-iteration-count: infinite | number;  /* 播放次数 infinite 为无限次 */
        animation-direction: normal | alternate;  /* 动画播放方向 */
        animation-play-state: running | paused;  /* 动画播放状态 */
        animation-fill-mode: none | forwards | backwards | both;  /* 动画结束后状态 */
    
    注意
        css3 动画分 补间动画(连续) 和 跳跃动画(非连续)
        
        animation-timing-function 作用于两个关键帧之间 而不是整个动画
        使用 steps(n, [start|end]) 的动画就是跳跃动画
            第一个参数指定动画分多少份(间隔)
            第二个参数表示在每个间隔的 开始 或 结束 时发生跳跃
                steps(n, start) 相当于 step-start
                steps(n, end) 相当于 step-end
	
3. 例
	/* 定义 */
	@keyframes moveRight {
		from {left:0; }
		to {left:600px;}
	}
	/* 使用 */
	div {
		animation-name: moveRight;
		animation-duration: 6s;
		animation-timing-function: linear;
		animation-delay: 0s;
		animation-iteration-count: infinite;
		animation-direction: normal;
		animation-play-state: running;
	}
</pre>	

###### 变形
<pre>
变形都是相对自身来说的

1. 语法
    transform: rotate translate scale skew matrix;  /* 多个效果用空格分割 */
        1 旋转
            rotate(angle);
            rotateX(angle);
            rotateY(angle);
            rotate3d(x, y, z, angle);
                x: 是一个 0 到 1 之间的数值 描述元素围绕 x 轴旋转的矢量值
                y: 是一个 0 到 1 之间的数值 描述元素围绕 y 轴旋转的矢量值
                z: 是一个 0 到 1 之间的数值，主要用来描述元素围绕Z轴旋转的矢量值
                angle: 是一个角度值 主要用来指定元素在 3d 空间旋转的角度 如果其值为正值 元素顺时针旋转 反之元素逆时针旋转
            
            注意
                当元素围绕 x 或 y 做 3d 旋转后如果不是在 3d 场景内 则在平面效果看来只是元素大小发生变矮变窄效果
                
        2 移动
            translate(x[, y]);
            translateX(value);  /* x 移动 */
            translateY(value);  /* y 移动 */
            translateZ(value);  /* z 轴移动 */
            
        3 缩放
            scale(x[, y]);
            scaleX(number);
            scaleY(number);
            
        4 扭曲
            skew(xangle [, yangle]);
            skewX(angle);
            skewY(angle);
            
        5 矩阵
            matrix(number, number, number, number, number, number);
            
        6 改变元素基点 一般操作都以元素自己中心位置进行变化 可以利用该属性改变基点位置
            transform-origin: x y;
                x 值除了具体数值外也可以是 left center right
                y 值除了具体数值外也可以是 top center bottom
</pre>

###### 3d 场景
<pre>
要显示 3d 效果 首先要创建一个 3d 场景
1. perspective: length;
    物体到屏幕的距离

2. perspective-origin: x-axis y-axis;
    视点位置
    x-axis 定义该视图在 x 轴上的位置 默认 50%
    y-axis 定义该视图在 y 轴上的位置 默认 50%

3. transform-style: flat | preserve-3d;
    规定子元素按照 平面 或者 3d 效果显示
</pre>

###### 过渡
<pre>
1. 语法
    transition: transition-property transition-duration transition-timing-function transition-delay;
        多个效果之间用逗号分割
        1. transition-property: none | all | propertyname;
        2. transition-duration: time;
        3. transition-timing-function: ease | linear | ease-in | ease-out | ease-in-out | cubic-bezier;
        4. transition-delay: time;

3. 例
    div {transition: background 0.5s ease-in, color 0.3s ease-out;}
</pre>