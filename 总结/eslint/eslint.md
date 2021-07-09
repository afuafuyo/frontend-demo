## Eslint 使用

#### 1. 借助于 git 的代码提交 hook ，在代码提交前监测代码

```bash
npm install pre-commit
```

#### 2. 安装 eslint

```bash
npm install eslint
```

#### 3. 生成 eslint 配置文件

```bash
// 这样执行的命令 配置文件会生成到 ./node_modules/.bin/ 目录 手动拷贝出来即可
./node_modules/.bin/eslint --init
```

根据需要修改配置文件

```json
// .eslintrc.js
module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "@typescript-eslint"
    ],
    // 主要修改这部分
    "rules": {
        "@typescript-eslint/no-explicit-any": 0,
        "@typescript-eslint/explicit-module-boundary-types": 0,
        "prefer-const": 0,
        "@typescript-eslint/no-this-alias": 0,
        "@typescript-eslint/no-empty-function": 0,
        "@typescript-eslint/no-unused-vars": 0
    }
};
```



#### 4. 配置 package.json

```json
// package.json 片段
{
  "scripts": {
    // 只检测 src 目录下的文件
    "test": "./node_modules/.bin/eslint src"
  },
  "pre-commit": [
    // 在代码提交前执行 test 命令
    "test"
  ]
}
```



## 结合 lint-staged 检测代码

如果使用 eslint 全局检测，比较花费时间， lint-staged 能够只检测暂存区的文件，速度比较快

lint-staged 同样也可以结合 pre-commit 使用

#### 1.  安装 lint-staged

```bash
npm install lint-staged --save-dev
```

#### 2. 修改 package.json

```json
// package.json 片段
{
  "scripts": {
    // 命令再触发 lint-staged
    "staged-test": "lint-staged"
  },
  "pre-commit": [
    // 调用 staged-test 命令
    "staged-test"
  ],
  "lint-staged": {
    "src/**/*.{js,ts,tsx,react}": "./node_modules/.bin/eslint"
  }
}
```

