## Object.defineProperty()

静态方法 `Object.defineProperty()` 用来精确地在一个对象上定义一个属性或者修改一个已经存在的属性，然后返回这个对象

通过普通赋值方式添加到对象的属性是可枚举、可修改、可删除的，但此方法可以修改这些行为



#### 语法

```javascript
/**
 * @param obj 要定义属性的对象
 * 
 */
Object.defineProperty(obj, prop, descriptor)
```



#### 属性描述符分类

descriptor 表示属性描述符，可以分为两类

###### 1. 数据描述符（ data descriptors ）

数据描述符是一个带有值的属性

###### 2. 存取描述符（ accessor descriptors ）

存取描述符是由 `getter` 函数和 `setter` 函数所描述的属性



数据描述符和存取描述符只能同时出现一种，两者不能同时使用