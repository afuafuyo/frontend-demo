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
        
    如果没有指定背景色 ( 没有调用 gl.clearColor() ) 那么将使用一下默认值
    
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
        用来描述定点特性 位置 颜色 等
    
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













</pre>















