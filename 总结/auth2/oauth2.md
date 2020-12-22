## Oauth2.0 四种授权模式

1. 授权码模式

    授权码（ authorization code ）指第三方应用先申请一个授权码，再用授权码获取令牌（ access token ）进行资源访问。这种方式需要借助服务端实现

2. 简化模式

    有些 Web 应用是纯前端应用，没有后端。这时就不能用上面的方式了，必须将令牌（ access token ）储存在前端。 RFC 6749 就规定了第二种方式，允许直接向前端颁发令牌。这种方式没有授权码这个中间步骤，所以称为（授权码）“隐藏式”（ implicit ）
    
3. 密码模式

    如果你高度信任某个应用， RFC 6749 也允许用户把用户名和密码直接告诉该应用。该应用就使用你的密码申请令牌（ access token ），这种方式称为“密码式”（ password ）

4. 客户端凭证模式

    适用于没有前端的命令行应用，即在命令行下请求令牌（ access token ）

## 授权码模式举例

#### 流程

1. 用户访问网站，网站将用户引导到认证服务器

    ```
    https://认证服务器.com/oauth/authorize?response_type=code&client_id=CLIENT_ID&redirect_uri=CALLBACK_URL
    ```

    + `client_id` 表示网站标识，让认证服务器知道是谁在发起请求
    + `redirect_uri` 表示回跳网址，一般是请求方的服务端地址，用户认证后会调到该地址

2. 用户同意授权，认证服务器根据 `redirect_uri` 进行回跳，并在网址追加一个授权码（ code ）

    ```
    https://网站.com/authcallback?code=AUTHORIZATION_CODE
    ```

    + `code` 表示授权码，该码有有效期，一般为 10 分钟，且只能使用一次

    此步骤不能直接返回令牌（ access token ）给网站，因为此步使用回跳地址以明文方式向网站传递数据。需要提供一个中间层，先返回 `code` ，网站服务端通过 `code` 在服务端发起请求获取令牌，避免了通过网址传递参数的安全隐患

3. 网站的 `服务端` 根据接收到的授权码 （ code ）并附上第 1 步中的 `redirect_uri` ，向认证服务器申请令牌（ access token ）

    ```
    https://认证服务器.com/oauth/token?client_id=CLIENT_ID&client_secret=CLIENT_SECRET&grant_type=AUTHORIZATION_CODE&code=AUTHORIZATION_CODE&redirect_uri=CALLBACK_URL
    ```

    + `client_id` 和 `client_secret` 用来让认证服务器确认网站的身份， `client_secret` 是保密的，所以只能放在服务端存储
    + `code` 表示第 2 步中获取的授权码
    + `redirect_uri` 必须和第 1 步中的值保持一致

4. 认证服务器核对授权码和 `redirect_uri` 向网站发送令牌（ access token ）

    网站拿到令牌，根据令牌访问资源服务器

## 官方协议

[https://tools.ietf.org/html/draft-ietf-oauth-v2-21](https://tools.ietf.org/html/draft-ietf-oauth-v2-21)

![](D:\github\frontend-demo\auth2\OAuth_guide_V2_1.png)