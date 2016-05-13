### 对应关系

+ npm
  - node 包管理工具
  - 通过 package.json 管理依赖
	
+ composer
  - php 包管理工具
  - 通过 composer.json 管理依赖

+ bower
  - web 包管理工具 依赖 github
  - 通过 bower.json 管理依赖
	
+ yeoman
  - webapp 脚手架

+ grunt
  - js 任务执行器
  - 通过 Gruntfile.js 配置要执行的任务


### Gruntfile 文件由四部分组成
1. wrapper 函数
2. 任务配置与目标
3. 加载 grunt 插件
4. 自定义任务

### 示例

```javascript
module.exports = function(grunt) {
	
	/* 任务配置与目标 */
	grunt.initConfig({
		// 自定义任意数据
		pkg: grunt.file.readJSON('package.json'),
		
		// 合并任务配置
		concat: {
			// 任务 option 属性 可选
			options: {
				separator: ';'  // 定义一个用于插入合并输出文件之间的字符
			},
			mytarget: {
				src: ['src/*.js'],  // src 下所有 js 结尾的文件
				dest: 'dist/concat.js'  // 合并后文件
			}
		},
		
		// 压缩任务配置
		uglify : {
			// 任务 option 属性 可选
			options : {
				banner : '/* 这里是文件注释 */\n'  // 用于在文件顶部生成一个注释
			},
			// 任务目标配置 目标名是自定义的
			mytarget : {
				src : '<%= concat.mytarget.dest %>',  // 压缩合并的文件
				dest : 'dist/concat.min.js'  // 压缩后文件
			}
		}
	});
	
	/* 加载能提供上述任务的 grunt 插件 */
	grunt.loadNpmTasks('grunt-contrib-uglify');  // 加载压缩插件
	grunt.loadNpmTasks('grunt-contrib-concat');
	
	/* 自定义任务 */
	grunt.registerTask('compress', ['concat', 'uglify']);  // grunt compress 命令会执行 concat 和 uglify 任务
};
```

----------

### Wrapper 函数

```javascript
module.exports = function(grunt) {};
```

### 任务配置与目标

+ 大部分的 Grunt 任务都依赖某些配置数据 这些数据被定义在一个 object 内并传递给 grunt.initConfig 方法 一般任务名和插件名相同 目标名称自定义

```javascript
grunt.initConfig({
    task1 : {
        target1: {},
        target2: {}
    },
    task2 : {
        target1: {},
        target2: {}
    }
});
```

### 任务配置与目标 - 目标简洁模式

+ 这种形式允许每个目标对应一个 src-dest 文件映射

```javascript
mytarget: {
    src: 'src/demo.js',
    dest: 'public/demo.min.js'
}
```

### 任务配置与目标 - 目标文件对象格式 files: {}

+ 这种形式支持每个目标对应多个 src-dest 形式的文件映射 属性名就是目标文件 源文件就是它的值 不能够给每个映射指定附加的属性

```javascript
mytarget: {
    files: {
        'dest/demo.js': ['src/demo1.js', 'src/demo2.js'],
        'dest/a.js': ['src/a1.js', 'src/a2.js'],
    }
}
```

### 任务配置与目标 - 目标文件数组格式 files: []

+ 这种形式支持每个目标对应多个 src-dest 形式的文件映射 允许每个映射拥有额外属性

```javascript
mytarget: {
    files: [
        {src: ['src/demo1.js', 'src/demo2.js'], dest: 'dest/demo.js'},
        {src: ['src/a1.js', 'src/a2.js'], dest: 'dest/a.js'},
    ]
}
```

### 通配符模式

+ * -- 匹配任意数量的字符 但不匹配 /
+ ? -- 匹配单个字符 但不匹配 /
+ ** -- 匹配任意数量的字符 包括 / 只要它是路径中唯一的一部分
+ {} -- 允许使用一个逗号分割的 “或” 表达式列表
+ ! -- 在模式的开头用于排除一个匹配模式所匹配的任何文件

### 加载 Grunt 插件

```javascript
grunt.loadNpmTasks( 插件名 );
```

### 自定义任务

```javascript
grunt.registerTask('default', ['uglify']);
```
	
+ 上面是提供一个默认任务 自定义的任务名和插件名不能一样

### 运行任务

```javascript
grunt [任务名][:目标名]
```
 
+ 当运行一个任务时 Grunt 会自动查找配置对象中的同名属性 遍历所有目标 并依次处理

```javascript
grunt uglify  // 依次运行 uglify 任务下所有目标
```

+ 同时指定任务和目标 将只会处理指定目标的配置

```javascript
grunt concat:foo  // 只运行 concat 任务的 foo 目标
```

+ 如果不指定任务名 将会执行 default 任务
+ 注意 此时 default 任务必须要存在 不然会报错

```javascript
grunt  // 这样会执行 default 任务 和执行 grunt default 效果一样
```

