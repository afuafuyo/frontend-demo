<pre>
/**
 * webgl api
 */
1. 指定绘图区域的背景色
    gl.clearColor(red, green, blue, alpha)

    一旦指定了背景色后 背景色就会驻存在 webgl 系统中 在下次调用 gl.clearColor() 前都不会改变

2. 清空
    gl.clear(buffer)
    
    将指定缓冲区设置成预定的值
    如果清空的是颜色缓冲区 那么将使用 gl.clearColor() 指定的值作为预定值

    buffer
        gl.COLOR_BUFFER_BIT  颜色缓冲区
        gl.DEPTH_BUFFER_BIT  深度缓冲区
        gl.STENCIL_BUFFER_BIT  模板缓冲区
        
    如果没有指定背景色 ( 没有调用 gl.clearColor() ) 那么将使用以下默认值
    
    ---------------------------------------------------------------------------
    缓冲区       |   默认值         |   相关函数
    ---------------------------------------------------------------------------
    颜色缓冲区   |   (0, 0, 0, 0)   |   gl.clearColor(red, green, blue, alpha)
    ---------------------------------------------------------------------------
    深度缓冲区   |   1              |   gl.clearDepth(depth)
    ---------------------------------------------------------------------------
    模板缓冲区   |   0              |   gl.clearStencil(s)
    ---------------------------------------------------------------------------
    
3. WebGLShader 着色器
    
    1) 顶点着色器
        用来描述顶点特性 位置 颜色 等
    
    2) 片元着色器
        进行逐片元处理 光照等
    
4. WebGLProgram 程序
    
    WebGLProgram 将编译后的着色器连接到 webgl 上

5. 绘制

    gl.drawArrays(mode, first, count)

    mode 绘制方式
        gl.LINES
        gl.LINE_STRIP
        gl.LINE_LOOP
        gl.TRIANGLES
        gl.TRIANGLE_STRIP
        gl.TRIANGLES_FAN
        
    first 从哪个点开始绘制
    count 绘制需要用到多少个顶点

6. attribute 变量
    一般用于传输和顶点有关的数据 从外部往顶点着色器传递数据

    格式
        attribute vec4 a_Position;
            |       |        |
        存储限定符 类型    变量名

    获取 attribute 变量地址
       每个 attribute 变量都有一个存储地址 以便通过地址给变量传输数据
       
        gl.getAttributeLocation(program, name): int
            program 包含顶点着色器和片元着色器的程序对象
            bane attribute 变量名称

    attribute 变量赋值
        获取到地址后 可以向变量传输数据

        gl.vertexAttrib3f(location, v0, v1, v2): void
            location 变量地址
            v0 第一个分量值
            v1 第二个分量值
            v2 第三个分量值

7. uniform 变量
    一般用于传输和片元有关的数据
    
    格式
        uniform vec4 u_FragColor;

    获取 uniform 变量地址
        gl.getUniformLocation(program, name): non-null | null
            program 包含顶点着色器和片元着色器的程序对象
            bane uniform 变量名称

    uniform 变量赋值
        获取到地址后 可以向变量传输数据

        gl.uniform4f(location, v0, v1, v2, v3): void
            location 变量地址
            v0 第一个分量值
            v1 第二个分量值
            v2 第三个分量值
            v3 第四个分量值

8. 缓冲区对象
    缓冲区是 WebGL 系统中的一块存储区

    使用缓冲区对象步骤
        1. 创建缓冲区对象 (gl.createBuffer())
        2. 绑定缓冲区对象 (gl.bindBuffer())
        3. 数据写入缓冲区 (gl.bufferData())
        4. 缓冲区对象分配给 attribute 变量 (gl.vertexAttribPointer())
        5. 开启 attribute 变量 (gl.enableVertexAttribArray())
        
    创建删除缓冲区对象
        gl.createBuffer(): non-null | null
        gl.deleteBuffer(): void
    
    绑定缓冲区
        将缓冲区对象绑定到 WebGL 系统已存在的目标 (target) 上
        
        gl.bindBuffer(target, buffer): void
            target
                gl.ARRAY_BUFFER 表示缓冲区对象包含了顶点数据
                gl.ELEMENT_ARRAY_BUFFER 表示缓冲区对象包含了顶点的索引值
            
            buffer 缓冲区对象
                
    向缓冲区对象写数据
        不能直接向缓冲区写数据 只能向目标写入 所以写入数据前要先将缓冲区对象绑定到目标
        
        gl.bufferData(target, data, usage): void
            target
                gl.ARRAY_BUFFER 或 gl.ELEMENT_ARRAY_BUFFER
            data 要写入的数据
            usage
                表示程序如何使用存储在缓冲区对象中的数据
                
                gl.STATIC_DRAW 只会向缓冲区对象写入一次数据 但需要绘制多次
                gl.STREAM_DRAW 只会向缓冲区对象写入一次数据 然后绘制若干次
                gl.DYNAMIC_DRAW 向缓冲区对象多次写入数据 并绘制很多次

    将缓冲区对象分配给 attribute 变量
        原来使用 gl.vertexAttrib[1234]f 系列函数为 attribute 变量赋值
        但是这些方法一次只能向 attribute 变量分配一个值
        然而现在需要将整个数组中的值一次性分配给 attribute 变量 所以需要使用 gl.vertexAttribPointer()

        gl.vertexAttribPointer(location, size, type, normalized, stride, offset): void
            location 变量地址
            size 缓冲区中每个顶点的分量个数 (1-4)
            type
                gl.UNSIGNED_BYTE 无符号字节
                gl.SHORT 短整型
                gl.UNSIGNED_SHORT 无符号短整型
                gl.INT 整型
                gl.UNSIGNED_INT 无符号整型
                gl.FLOAT 浮点型
            normalized 是否将非浮点型的数据统一化到 [0, 1] 或 [-1, 1] 之间
            stride 指定相邻两个顶点简的字节数 默认 0
            offset 指定缓冲区对象中的偏移量 字节为单位

    开启 attribute 变量
        为了使顶点着色器可以访问缓冲区的数据 需要开启 attribute 变量
        
        gl.enableVertexAttribArray(location): void
            location 变量地址
        gl.disableVertexAttribArray(location): void

9. 坐标

webgl 坐标原点在容器中心

                (0, 1, 0)
                    |
                    |   (0, 0, -1)
                    |   /
                    |  /
                    | /
                    |/
(-1, 0, 0)----------|---------->(1, 0, 0)
                   /|
                  / |
                 /  |
                /   |
        (0, 0, 1)   |
                    |
                (0, -1, 0)

10. 视点、观察目标点、上方向

视点
    视点是观察者所在的三维空间位置 是视线起点 用 (eyeX, eyeY, eyeZ) 表示

观察目标点
    观察目标点是一个点 而不是视线方向 用 (atX, atY, atZ) 表示 同时知道视点和观察目标点才可以知道视线方向

上方向
    上方向是绘制在屏幕上的影像的向上的方向 用 (upX, upY, upZ) 表示

在 WebGL 中可以用 视点、观察目标点、上方向 三个矢量创建一个视图矩阵来标示观察者状态





11. 视线

视线
    视线是从视点出发沿着观察方向的射线

webgl 中默认情况下视点在原点 (0, 0, 0) 视线为 Z 轴负半轴指向屏幕内部













































</pre>
