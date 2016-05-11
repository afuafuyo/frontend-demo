### HTTP简介

+ WEB 浏览器与 WEB 服务器之间的一问一答的交互过程必须遵循一定的规则，这个规则就是HTTP协议
+ HTTP 是 hypertext transfer protocol ( 超文本传输协议 ) 的简写，它是 TCP/IP  协议集中的一个应用层协议，用于定义 WEB 浏览器与 WEB 服务器之间交换数据的过程以及数据本身的格式
+ HTTP 协议的版本 HTTP/1.0, HTTP/1.1, HTTP-NG

### HTTP 1.0 的会话方式

+ 四个步骤
+ ![image](imgs/socket.jpg)
+ 浏览器与 WEB 服务器的连接过程是短暂的，每次连接只处理一个请求和响应。对每一个页面的访问，浏览器与 WEB 服务器都要建立一次单独的连接
+ 浏览器到 WEB 服务器之间的所有通讯都是完全独立分开的请求和响应对
+ ![image](imgs/eachlink.jpg)

### 浏览器访问多图网页的过程

+ 访问过程
+ ![image](imgs/access.jpg)

### HTTP 1.1 与 HTTP 1.0 的比较

+ HTTP 1.1 的特点
  - 在一个TCP连接上可以传送多个HTTP请求和响应
  - 多个请求和响应过程可以重叠进行
  - 增加了更多的请求头和响应头
+ ![image](imgs/multilink.jpg)

### HTTP 请求消息

+ 请求消息的结构
一个请求行、若干消息头、以及实体内容。其中的一些消息头和实体内容都是可选的， **消息头和实体内容之间用空行隔开**
+ 举例
<pre>
GET /index.html HTTP/1.1
Accept: */*
Accept-Language: en-us
Connection: Keep-Alive
Host: localhost
Content-Length: 0
User-Agent: Mozilla/4.0
Accept-Encoding: gzip, deflate
< 注意这里有一个空行 >
</pre>

### HTTP 响应消息

+ 响应消息的结构
一个状态行、若干消息头、以及实体内容 ，其中的一些消息头和实体内容都是可选的， **消息头和实体内容之间用空行隔开**
+ 举例
<pre>
HTTP/1.1 200 OK
Server: Microsoft-IIS/5.0
Date: Thu, 13 Jul 2000 05:46:53 GMT
Content-Length: 2291
Content-Type: text/html
Cache-control: private

从这行开始是服务器返回数据 ...
</pre>

### HTTP 消息 其他细节

+ 响应消息的实体内容就是网页文件的内容，也就是在浏览器中使用查看源文件的方式所看到的内容
+ 一个使用 GET 方式的请求消息中不能包含实体内容，只有使用 POST、PUT 和 DELETE 方式的请求消息中才可以包含实体内容
+ 对于 HTTP 1.1 来说，如果 HTTP 消息中包括实体内容，且没有采用 chunked 传输编码方式，那么消息头部分必须包含内容长度的字段，否则，客户和服务程序就无法知道实体内容何时结束
+ 在 HTTP 协议中，还可以使用简单的请求消息和响应消息，它们都没有消息头部分。简单的请求消息只能用于 GET 方式，且请求行中不用指定 HTTP 版本号。对于简单的请求消息，服务器返回简单的响应消息，简单的响应消息中只返回实体内容

### 请求行与状态行

+ 请求行
  - 格式： 请求方式 资源路径 HTTP版本号< CRLF >
  - 举例： GET /index.html HTTP/1.1
  - 请求方式： POST HEAD OPTIONS DELETE TRACE PUT

+ 状态行
  - 格式： HTTP版本号 状态码 原因叙述< CRLF >
  - 举例：HTTP/1.1 200 OK

### HTTP 消息头

+ 使用消息头，可以实现 HTTP 客户机与服务器之间的条件请求和应答，消息头相当于服务器和浏览器之间的一些暗号指令
+ 消息头格式： **一个头字段名称，然后依次是冒号、空格、值、回车和换行符**
  - eg. Accept-Language: en-us
+ 消息头字段名是不区分大小写的，但习惯上将每个单词的第一个字母大写
+ 整个消息头部分中的各行消息头可按任何顺序排列
+ 消息头又可以分为 **通用信息头、请求头、响应头、实体头** 等四类
+ 许多请求头字段都允许客户端在值部分指定多个可接受的选项，多个项之间以逗号分隔
  - Accept-Encoding: gzip, compress
+ 有些头字段可以出现多次，例如，响应消息中可以包含有多个 Warning 头字段

### URL 编码

+ 请求行和 HTTP 消息头中不能出现中文字符，中文字符需要按照 URL 编码方式转换成英文字符
+ 规则如下
  - 将空格转换为加号 (+)
  - 对 0-9  a-z A-Z 之间的字符保持不变
  - 对于所有其他的字符，用这个字符的当前字符集编码在内存中的十六进制格式表示，并在每个字节前加上一个百分号 (%) 。如字符 + 用 %2B 表示，字符 = 用 %3D 表示，字符 & 用 %26 表示，每个中文字符在内存中占两个字节，字符 中 用 %D6%D0 表示，字符 国 用 %B9%FA 表示
  - 对于空格也可以直接使用其十六进制编码方式，即用 %20 表示

### 使用 GET 和 POST 方式传递参数

+ 常见的在 URL 地址后面可以附加一些参数
  - http://www.abc.com/get.html?param1=xxx&param2=yyy

+ GET 方式
  - 举例： GET /get.html?param1=xxx&param2=yyy HTTP/1.1
  - 特点： 传送的数据量是有限制的，一般限制在 1KB 以下

+ POST 方式
<pre>
POST /post.html HTTP/1.1
Host:
Content-Type: application/x-www-form-urlencoded
Content-Length: 22
< 注意这里有一个空行 >
param1=xxx&param2=yyy
</pre>
**注意上面我们实际传的参数长度是 21 ，但是 Content-Length 是 22 ，这时服务器会等待我们继续输入剩下的一个字节，若 Content-Length 为 20 的话，这时服务器会把多余的一个截掉**

### 响应状态码

响应状态码用于表示服务器对请求的各种不同处理结果和状态，它是一个三位的十进制数。响应状态码可归为 5 种类别，使用最高位为 1 到 5 来进行分类，如下所示：
+ 100～199
  - 表示成功接收请求，要求客户端继续提交下一次请求才能完成整个处理过程
+ 200～299
  - 表示成功接收请求并已完成整个处理过程
+ 300～399
  - 为完成请求，客户需进一步细化请求。例如，请求的资源已经移动一个新地址
+ 400～499
  - 客户端的请求有错误
+ 500～599
  - 服务器端出现错误

### 通用信息头

+ 通用信息头字段既能用于请求消息，也能用于响应消息，它包括一些与被传输的实体内容没有关系的常用消息头字段
+ Cache-Control: no-cache
+ Connection: close/Keep-Alive
+ Date: Tue, 11 Jul 2000 18:23:51 GMT
+ Pragma: no-cache
+ Trailer: Date
+ Transfer-Encoding: chunked
+ Upgrade: HTTP/2.0, SHTTP/1.3
+ Via: HTTP/1.1 Proxy1, HTTP/1.1 Proxy2 
+ Warning: any text

### 请求头

+ 请求头字段用于客户端在请求消息中向服务器传递附加信息，主要包括客户端可以接受的数据类型、压缩方法、语言、以及发出请求的超链接所属网页的 URL 地址等信息
  - Accept: text/html,image/*
  - Accept-Charset: ISO-8859-1,unicode-1-1
  - Accept-Encoding: gzip,compress
  - Accept-Language: en-gb,zh-cn
  - Authorization: Basic enh4OjEyMzQ1Ng==
  - Expect: 100-continue
  - From: xxx@xxx.org
  - Host: www.xxx.org:80
  - If-Match: "xyzzy", "r2d2xxxx"
  - If-Modified-Since: Tue, 11 Jul 2000 18:23:51 GMT
  - If-None-Match: "xyzzy", "r2d2xxxx"
  - If-Range: Tue, 11 Jul 2000 18:23:51 GMT
  - If-Unmodified-Since: Tue, 11 Jul 2000 18:23:51 GMT
  - Max-Forwards: 1
  - Proxy-Authorization: Basic enh4OjEyMzQ1Ng==
  - Range: bytes=100-599
    + Range: bytes=100-  表示从 100 个字节后
    + Range: bytes=-100  表示从 100 个字节前
  - Referer: http://www.xxx.org/index.html
  - TE: trailers,deflate
  - User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64)

### 响应头

+ 响应头字段用于服务器在响应消息中向客户端传递附加信息，包括服务程序名，被请求资源需要的认证方式，被请求资源已移动到的新地址等信息
  - Accept-Range: bytes
  - Age: 315315315
  - Etag: b38b9-17dd-367c5dcd
  - Location: http://www.xxx.org/index.html
  - Proxy-Authenticate: BASIC realm="xxx"
  - Retry-After: Tue, 11 Jul 2000 18:23:51 GMT
  - Server: Microsoft-IIS/5.0
  - Vary: Accept-Language
  - WWW-Authenticate: BASIC realm="xxx"

### 实体头

+ 实体头用作实体内容的元信息，描述了实体内容的属性，包括实体信息类型、长度、压缩方法、最后一次修改时间、数据有效期等
  - Allow: GET,POST
  - Content-Encoding: gzip
  - Content-Language: zh-cn
  - Content-Length: 80
  - Content-Location: http://www.xxx.org/content.html
  - Content-MD5: ABCDABCDABCDABCDABCDAB==
  - Content-Range: bytes 2543-4532/7898
  - Content-Type: text/html; charset=GB2312
  - Expires: Tue, 11 Jul 2000 18:23:51 GMT
  - Last-Modified: Tue, 11 Jul 2000 18:23:51 GMT

+ Content-MD5
浏览器虽然接收到了服务器返回的内容，但是不敢肯定服务器发送的内容在传输过程中是否发生了损坏，那就可以通过这个 Content-MD5 来验证

### 扩展头

+ 在 HTTP 消息中，也可以使用一些在 HTTP 1.1 正式规范里没有定义的头字段，这些头字段统称为自定义的 HTTP 头或扩展头，它们通常被当作是一种实体头处理
+ 现在流行的浏览器实际上都支持 Cookie Set-Cookie Refresh 和 Content-Disposition 等几个常用的扩展头字段

