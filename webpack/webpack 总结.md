# webpack 使用总结


## 只使用 babel-loader 构建项目

1. webpack 配置

```
const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/index.tsx',
    output: {
        filename: 'editor.js',
        path: __dirname + '/dist',
        publicPath: '/',

        libraryTarget: 'umd',
        library: 'global var name of the lib'
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                use: [
                    // 使用 babel 编译项目
                    // babel 通过 preset 插件解析 ts 和 react 文件
                    // preset 配置在 babel.config.js 中
                    { loader: 'babel-loader' }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
            {
                test: /\.(jpg|png|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        // 1KB 以内的文件编译成 base64
                        limit: 1024
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: [ '.js', '.tsx', '.ts' ],
        modules: ['node_modules'],
    },
    externals: {
        react: 'React',
        'react-dom': 'ReactDom'
    }
};

```

2. babel.config.js

```
module.exports = {
    presets: [
        // 配置转换 ts 的处理器
        "@babel/preset-typescript",
        // 配置转换 react 的处理器
        "@babel/preset-react"
    ],
    plugins: [
        // 当类中使用了成员变量或者箭头函数 那么 babel 默认无法识别 需要安装以下插件
        ["@babel/plugin-proposal-class-properties", { loose: true }]
    ]
};

```


## 同时使用 ts-loader 和 babel-loader

使用 ts-loader 可以检测 ts 的语法错误 可以避免提交错误代码

1. webpack 配置

```
const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/index.tsx',
    output: {
        filename: 'editor.js',
        path: __dirname + '/dist',
        publicPath: '/',

        libraryTarget: 'umd',
        library: 'global var name of the lib'
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                use: [
                    // 先 ts-loader 解析 typescript 然后 babel 解析 react
                    { loader: 'babel-loader' },
                    // ts-loader 通过 tsconfig.json 配置
                    { loader: 'ts-loader' }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        // 启用 css 的模块化
                        // 如果不设置 那么引入的 css 会原样输出到页面
                        // 可能导致重名问题 而且不支持 <div className={css.wrapper}></div> 这种语法
                        // 加上模块化配置 就可以支持 className={css.wrapper} 这种语法了
                        loader: 'css-loader',
                        options: {
                          modules: {
                            localIdentName: "[name]-[local]-[hash:base64:5]"
                          },
                          sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.(jpg|png|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        // 1KB 以内的文件编译成 base64
                        limit: 1024
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: [ '.js', '.tsx', '.ts' ],
        modules: ['node_modules'],
    }
};
```

2. tsconfig.json

```
tsconfig.json

{
    "compilerOptions": {
        // Base directory to resolve non-relative module names
        "baseUrl": ".",

        "paths": {
            // 注意 paths 是根据 baseUrl 的配置来解析的
            // 表示 baseUrl 下的 node_modules/jquery/dist/ 目录中的 jquery
            "jquery": ["node_modules/jquery/dist/jquery"]
        },

        // 生成的 js 代码使用哪种模块系统组织 "CommonJS"，"AMD", "ES6" 等
        "module": "CommonJS",

        // 生成的 js 是哪个版本 "ES5", "ES6", "ESNext" 等
        "target": "ES5",

        // 加载模块的方式 这里指定用模拟 node 加载模块的方式来处理源代码
        "moduleResolution": "Node",
        "sourceMap": false,
        "allowJs": true,

        // 告诉 ts 不要转换 jsx 而是交给 babel 转换 如果这里值为 "react" 那么 ts-loader 就可以直接编译 react 而不必使用 babel
        "jsx": "preserve",

        // Redirect output structure to the directory
        "outDir": "./dist",

        // 是否为 ts 文件生成 .d.ts 声明文件
        "declaration": false,

        // 允许默认导入语法
        "allowSyntheticDefaultImports": true,

        // 检查没有使用的方法参数
        "noUnusedParameters": true,

        // 检查没有使用的变量
        "noUnusedLocals": true
    },
    // 指定源代码目录 如果不指定 那么编译器会查找当前目录和所有子目录
    "include": [
        "src/**/*"
    ],
    // 这个目录下的代码不会被 typescript 检查
    "exclude": [
        "dist"
        "node_modules"
    ]
}
```


## 配置说明

* output

    libraryTarget 指定将代码打包成什么形式 比如 umd

    library 当使用 umd 打包代码时 可以使用 library 指定该库在全局作用于的名字

* resolve

    可以使得引入文件的时候不必写后缀

* externals

    可以将一些公共库不进行打包处理

    如果代码打包成 UMD 格式 得看第三方包全局变量叫什么
    比如 react 的 umd 包在全局上叫做 React 那么我们的配置应该也写作大写

    ```
    externals: {
        'react': 'React',
        'react-dom': 'ReactDom'
    }
    ```

    如果是打包成 ES6 格式 那么需要使用小写

    ```
    externals: {
        'react': 'react',
        'react-dom': 'react-dom'
    }
    ```

    当然还有其他种类的配置方式 看官方文档

* devServer

    contentBase 绝对路径 表示网站的根目录 比如 path.join(__dirname, 'dist')

publicPath 表示静态资源的路径

    如果配置成 / 那么表示资源就在 contentBase 下 那么 script 引入地址为 /xxx.js
    如果设置成 /dist 那么表示资源在 contentBase/dist 下 那么 script 引入地址为 /dist/xxx.js


## ESLint

是用来校验 js 规范性的工具 它的默认解释器为 Espree 不能进行 typescript 的校验
如果需要进行 typescript 校验 需要使用解析 typescript 的解释器
在 .eslintrc.js 中添加如下语句

```
"parser": "@typescript-eslint/parser",
```


## import & export


#### export

1. commonjs 导出模块

```
module.exports = function() {}
```

2. es6 导出模块

```
export default function() {}
```

3. babel 编译 es6 之后导出模块形式

```
exports.default = function () {}
```

#### import

1. 导入 commonjs 模块

```
import * as Xx from 'xx';
const Xx = require('xx');
```

2. 导入标准 ES6 模块

```
import Xxx from 'xxx';
```


2 中这样的语法只适用于 es6 的默认模块导出

但是 babel 会将 es6 的导出语句编译为 `export.default` 语法

这种语法在 typescript 中会报错 所以在 tsconfig.json 中提供了 `allowSyntheticDefaultImports` 属性来兼容 `export.default` 默认导出语法


## typescript 中引入 css

通常直接在 ts 中写 `import css from './css.css';` 会报 `cannot find module`

因为 ts 识别不了 css ，为了让 ts 能够识别 需要生成一个 .d.ts 的声明文件

1. 生成 .d.ts 文件

这个文件可以用第三方插件来自动生成 比如 `typed-css-modules 或者 typings-for-css-modules-loader`

2. 添加通过配置

在项目根目录下新建一个 `typings` 文件夹 再新建通用声明文件

```
declare module '*.scss' {
    const content: {[className: string]: string};
    export default content;
}

declare module '*.png' {
    const content: string;
    export = content;
}
```
