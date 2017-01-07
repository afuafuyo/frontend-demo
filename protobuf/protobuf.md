# protobuf javascript

* 编译器 (protoc)
  + 编译 .proto 文件
* 运行时 (runtime)
  + 运行时需要的一些库文件

### 编译

src/User.proto

```
syntax = "proto3";

package app.lib;

message User {
    int32 id = 1;
    string name = 2;
    int32 age = 3;
}

message UserList {
    User user = 1;
}
```

```shell
protoc src/User.proto --js_out=bin
protoc src/User.proto --js_out=bin --proto_path=src
protoc src/User.proto --js_out=library=mylib,binary:bin
protoc src/User.proto --js_out=import_style=commonjs,binary:bin
```
js_out 后面不是目录的时候需要使用 binary 指定生成目录

* --js_output=bin 指定生成文件路径 文件名不变 bin 目录必须存在
* --js_out=library=mylib,binary:bin 生成指定名字的文件 mylib.js , bin 目录必须存在
* import_style 选项指定代码规范 支持两种： 闭包 和 commonjs 规范 不支持 es6 规范
* 一些编译选项只能用到闭包代码格式中

```
add_require_for_enums, testonly, library, error_on_name_conflict, broken_proto3_semantics, extension, and one_output_file_per_input_file 
```

### 包定义

包定义只对闭包代码有效， commonjs 中会忽略 ，如果在 message 文件中定义了 package 字段，生成的代码中会使用 proto 作为包的一部分，如果没有定义 package 那么

### 示例

```javascript
'use strict';

var user_pb = require('./User_pb');

class Demo  {
    
    run(req, res) {        
        var user = new user_pb.User();
        var userList = new user_pb.UserList();
        
        user.setId(1);
        user.setName('lisi');
        user.setAge(20);
        userList.setUser(user);
        
        var rs = userList.serializeBinary();
        
        res.end(rs.toString());
        
        this.parse(rs);
    }
    
    parse(str) {
        var userList = user_pb.UserList.deserializeBinary(str);
        var user = userList.getUser();
        
        console.log(user.getId(), user.getName(), user.getAge());
    }
}

module.exports = Demo;
```
