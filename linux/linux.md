<pre>
/**
 * vmware
 */
1. 网络连接方式 ( vmware )
    桥接模式 B
        虚拟机利用真实网卡和电脑通信
        只要虚拟机和真实机在同一网段 就能通信 局域网其他计算机也能和虚拟机通信
        缺点是虚拟机要占用一个 ip 地址
    NAT 模式 N
        虚拟机利用虚拟网卡 VMnet8 和电脑通信
        所以虚拟机的 ip 地址要和虚拟网卡在同一网段
        用 ifconfig 查看 ip
        用 ifconfig eth0 xxx.xxx.xxx.xxx 设置虚拟机 ip
    主机模式 H
        虚拟机利用虚拟网卡 VMnet1 和电脑通信
        
    NAT 和 Host-only 只能和本机通信
    NAT 如果真实机能访问网络 那么虚拟机也可以

/**
 * linux 分区
 */
在 windows 操作系统中 是先将物理地址分开 再在分区上建立目录 所有路径都是从盘符开始 如 C://data
linux 正好相反 是先有目录 再将物理地址映射到目录中

必要分区
    /  -- 根分区
    /boot  -- boot 分区
    /swap  -- 交换分区 一般是内存的 2 倍 通常 1G 就够了
其他分区
    /home  -- home 分区

一般按照以下顺序创建分区
/boot 分区  200M 够了
/swap 分区
/home 分区
/ 根分区 使用剩余所有空间

/**
 * linux 安装
 */
一般安装选择 安装或升级现有系统
主机名一般不用做修改
哪种类型的安装选择 自定义布局 来手动分区

/**
 * Linux 链接
 */
软连接
    权限信息 
        lrwxrwxrwx
            l  -- 软连接标示
            权限都是 读写执行 但是这个权限不决定源文件的权限
    类似于 window 快捷方式
    文件很小
    文件信息中箭头指向源文件
    删除原文件后 软链接文件就不能用了

硬链接
    文件的 权限 文件大小 修改日期等和源文件都一样
    修改其中一个文件 两个文件内容会同步更新
    删除源文件后 硬链接文件还能用
    不能跨分区
    不能针对目录使用

如何识别硬链接文件
    通过 i 节点识别
    查看文件 i 节点
        ls -i 文件
    源文件的 i 节点和硬链接的 i 节点一样

    linux 中每个文件都有一个 i 节点
    一个 i 节点不一定对应一个文件
    内核操作是针对 i 节点进行操作 所以硬链接文件和源文件可以同步更新

生成链接文件
    ln -s [源文件] [目标文件]
        -s  -- 创建软连接

/**
 * Linux 常用命令
 */
一个文件有 3 个权限属性
    u 所有者 
    g 所属组
    o 其他人
读写执行权限对目录操作
    r 可以列出目录中的内容
    w 可以在目录中创建删除文件
    x 可以进入目录
    所以你要删除一个目录下的文件 要看你对这个目录有没有写权限

1. 文件权限管理命令 chmod
    chmod [选项] [ugoa][+-=][rwx] 文件或目录
    chmod [选项] 权限 文件或目录
        -R  -- 递归遍历子目录 修改应到目录下所有文件和子目录

2. 其他命令
    改变文件或目录所有者 ( 只有 root 可以执行 )
        chown [选项] [--help] [--version] user[:group] file
            user  -- 新的档案拥有者

        将 /home 文件夹及其子目录的拥有者改为 root
        chown -R root:root /home
            
    改变文件所属组
        chgrp [组名] [文件或目录]

3. 文件处理命令
    创建文件
        touch 文件名1 [文件名2]
    删除文件 文件夹
        rm [选项] 文件或文件夹
            -r  -- 递归删除
            -f  -- 强制删除文件或目录
    显示文件内容 处理小文件
        cat [选项][文件名]
            -n  -- 显示行号
    分页显示文件内容 处理大文件
        more 文件名
            空格 或 f 翻页
            Enter 换行
            q 退出
    分页显示文件内容 处理大文件 可以向上翻页
        less 文件名
    显示前几行数据
        head [选项] 文件名
            -n number  -- 显示前 number 行
    显示最后几行数据
        tail [选项] 文件名
            -n number  -- 显示最后 number 行

4. 压缩解压
    4.1 .gz 格式
        压缩 (压缩后格式自动为 .gz)
            gzip [文件]
        解压
            gunzip [gz 格式文件]

    4.2 .bz2 格式
        压缩 (压缩后格式自动为 .bz2)
            bzip2 [选项] [文件]
                -k  -- 保留源文件
                -d  -- 执行解压缩
                -v  -- 压缩或解压缩文件时 显示详细的信息 
        解压
            bzip2 -d [bz2 格式文件]
            bunzip2 [bz2 格式文件]

    4.3 .zip 格式
        压缩 (保留源文件)
            zip [选项] [压缩后文件名] [文件或目录]
                -r  -- 目录递归处理
        解压
            unzip [选项] [zip 格式文件]

    4.4 打包目录
        tar [主选项+辅选项] 打包后文件 源文件或者目录
            压缩后格式习惯为 .tar
            如果打包并压缩 格式习惯为 .tar.gz 或 .tar.bz2
            主选项必填
                -c  -- 创建新的档案文件
                -x  -- 解压
            辅选项
                -v  -- 显示详细信息
                -f  -- 指定文件名
                -z  -- 打包同时以 gzip 压缩
                -j  -- 打包同时以 bzip2 压缩
            例
                tar -cvf /tmp/etc.tar /etc  -- 将 /etc 目录打包成 /tmp/etc.tar
                tar -czvf /tmp/etc.tar.gz /etc  -- 将 /etc 目录打包成 /tmp/etc.tar.gz

    4.5 其他
        解压 .tar.gz
            tar -xzvf 文件
        解压 .tar.bz2
            tar -xjvf 文件

/**
 * 软件包管理
 */
1. 软件包管理
    源码包
        安装时间较长
    二进制包 ( RPM包、系统默认包 )
        依赖包较多

2. rpm 命令管理 - 安装卸载
    包全名 操作的是没有安装的软件包时使用包全名
    包名 操作已经安装了的软件包时使用包名 这时是搜索 /var/lib/rpm/ 数据库确定软件

    RPM 安装软件
        rpm -ivh 包全名
            -i 安装
            -v 显示详细信息
            -h 显示进度
            --nodeps 不检测依赖 一般不用

    RPM 包升级
        rpm -Uvh 包全名
            -U 升级
            
    RPM 卸载
        rpm -e 包全名 ( 这里最好用包全名 )
            -e 卸载
            --nodeps 不检测依赖

3. rpm 命令管理 - 查询
    rpm [选项] 包名
        常用选项
        -q 查询
        -a 所有
        -i 软件信息
        -l 列表
        
    查询软件是否安装
        rpm -q 包名

    查询所有安装的 rpm 包
        rpm -qa
            
    查询软件包详细信息
        rpm -qi 包名
        rpm -qip 包全名  -- 看光盘目录中那些软件没安装
            -p 查询未安装包的信息
            
    查询软件包安装位置
        rpm -ql 包名
            
    查询系统文件属于哪个 RPM 包
        rpm -qf 系统文件名
            -f 查询系统文件属于哪个软件包
            
    查询软件包的依赖性
        rpm -qR 包名
            -R 查询软件包的依赖性
            -p 查询未安装包的信息
            
4. rpm 命令管理 - 校验和文件提取
    校验 RPM 包中的文件
        rpm -V 已安装的包名  -- 不返回任何数据表示是原厂包
            -V 校验制定 RPM 包中的文件
        
        验证结果中 8 个信息的解释
            S 文件大小是否改变
            M 文件的类型或文件权限是否改变
            5 文件的 MD5 校验是否改变
            D 设备中的代码是否改变
            L 文件路径是否改变
            U 文件的属组是否改变
            T 文件的修改时间是否改变

    将 rpm 包转换为 cpio 格式的命令
        rpm2cpio 包全名 | cpio 工具命令
            
    cpio 是一个标准工具 用于创建软件档案文件盒从档案文件中提取文件
        cpio 选项 <文件|设备>
            -i copy-in 模式 还原
            -d 还原时自动新建目录
            -v 显示还原过程

    比如我们误删除了 ls 命令文件 我们可以利用 rpm2cpio 还原一个新的 ls
        1 通过 rpm -qf /bin/ls 查询 ls 属于哪个包
        2 rpm2cpio /mnt/cdrom/packages/coreutils-8.4-19.el6.i686.rpm | cpio -idv ./bin/ls
        3 经过 2 后 ls 被提取到了当前目录的 bin/ 下
        4 把 ls 复制到系统目录 cp /root/bin/ls /bin/

5. rpm 包管理 - yum 在线管理 ip 地址配置和网络 yum 源
    基于 RPM 包管理 能够从指定的服务器自动下载 RPM 包并且安装 可以自动处理依赖性关系 并且一次安装所有依赖的软件包 无须繁琐地一次次下载安装
    配置 ip
        红帽系列
        1. setup 打开配置界面
        2. vi /etc/sysconfig/network-scripts/ifcfg-etho
            打开 ONBOOT=yes
        3. service network restart  重启网络服务
    网络 yum 源
        yum 源存放目录 
        /etc/yum.repos.d/
            这个目录中所有 .repo 结尾的都是 yum 源文件
            CentOS-Base.repo  -- 基本 yum 源  默认使用这个
            CentOS-Debuginfo.repo
            CentOS-Media.repo  -- 本地光盘 yum 源
            CentOS-Vault.repo  -- 虚拟 yum 源
        
        文件内容
        /etc/yum.repos.d/CentOS-Base.repo
            [base]  -- 容器名称 一定要放到 [] 中
            name  -- 容器说明
            mirrorlist  -- 镜像站点 可以注释掉
            baseurl  -- yum 源服务器地址 默认是 CentOS 官方的 yum 源服务器
            enabled  -- 此容器是否生效 默认是 1
            gpgcheck  -- 1 表示 RPM 的数字证书生效
            gpgkey  -- 数字证书的公钥文件保存位置
            
6. yum 在线管理 - yum 命令
    查询服务器所有可用软件包
        yum list
    查询服务器所有和关键字相关的包
        yum search 关键字( 包名 )
        
    安装软件
        yum -y install 包名
            install  -- 安装
            -y  -- 确认
    升级软件 谨慎操作
        yum -y update 包名
            update  -- 升级
            -y  -- 确认
    卸载 危险操作 会卸载依赖包
        yum -y remove 包名
            remove  -- 卸载
            -y  -- 确认

    yum 软件组管理
        yum grouplist
        yum groupinstall 软件组名
        yum groupremove 软件组名

7. yum 在线管理 - 光盘 yum 源
    7.1 挂载光盘
        mount /dev/cdrom /mnt/cdrom
    7.2 让网络 yum 源失效
        把网络 yum 源文件改个名使其失效
        mv CentOS-Base.repo CentOS-Base.repo.bak
    7.3 让光盘 yum 源生效
        修改 CentOS-Media.repo
            vim CentOS-Media.repo
            
            修改 baseurl=file:///mnt/cdrom  -- 自己的光盘挂载点 提供了 3 个示例地址 注释掉另外两个 file 地址 留一个自己的
            修改 enabled=1
            
8. 源码包管理 - 源码包与 RPM 包区别
    rpm 大多数包默认安装位置
        /etc/rc.d/init.d/  -- 服务安装目录
        /etc/  -- 配置文件安装目录
        /usr/bin/  -- 可执行命令安装目录
        /usr/lib/  -- 程序使用的函数库存放位置
        /usr/share/doc/  -- 基本的软件使用手册位置
        /usr/share/man/  -- 帮助文件保存位置
    源码包建议安装位置
        /usr/local/软件名/

    安装位置不同带来得影响
        RPM 包安装的服务可以使用系统服务管理命令 service 来管理

9. 源码包管理 - 源码包安装
    源代码保存位置
        /usr/local/src
    软件安装位置
        /usr/local/
    安装步骤
        解压软件包
        进入解压的目录
            注意查看 README 和 INSTALL 文件
        配置
        编译
        安装
        
        例 安装 apache
        1. 软件配置与检查 利用 ./configure 命令配置
            ./configure --prefix=/usr/local/apache2
                --prefix  -- 指定软件安装路径
        2. 编译
            make
            在这个阶段可以用 make clean 清除编译产生的临时文件
        3. 编译安装 此步骤才真正往硬盘安装软件
            make install  -- 真正安装
        
        注 
        ./configure 
            是一个 shell 脚本 是源代码安装的第一步
            主要的作用是对即将安装的软件进行配置
            检查当前的环境是否满足要安装软件的依赖关系
            生成符合 GNU 规范的 Makefile 文件 ( 里面配置了编译信息等 )
        
/**
 * 用户和用户组管理
 */ 
1. 用户配置文件 - 用户信息文件
    /etc/passwd  格式为 7 个字段
        用户名:密码标志:UID( 用户ID ):GID( 用户初始组ID ):用户说明:家目录:登陆后的shell
            UID 取值
                0 管理员
                1-499 系统用户( 伪用户 )
                500-65535 普通用户
            家目录
                普通用户 /home/用户名/
                管理员 /root/

2. 用户配置文件 - 影子文字
    /etc/shadow  格式为 9 个字段
        用户名:加密密码:密码最后修改时间:两次修改密码时间间隔:密码有效期:密码到期前警告天数:密码过期后的宽限天数:账号失效时间:保留
            加密密码 取值
                !! 或者 * 表示用户无密码
            密码最后修改时间
                1970 年后的多少天
            密码过期后的宽限天数
                0 过期立即失效
                -1 永远不会失效
            账号失效时间
                时间戳表示

3. 用户配置文件 - 组信息文件
    /etc/group  格式为 4 个字段
        组名:组密码标志:GID:组中附加用户
    /etc/gshadow
        组名:组密码:组管理员用户名:组中附加用户

4. 用户配置文件 - 用户管理相关文件
    用户家目录
        普通用户 /home/用户名/ 权限是 700
        超级用户 /root/ 权限是 550

5. 用户管理命令 - useradd  添加用户
    useradd [选项] 用户名
        -u UID  -- 手动指定用户UID号
        -d 家目录  -- 手动指定用户家目录
        -c 用户说明  -- 手动指定用户的说明
        -g 组名  -- 手动指定用户的初始组
            指定了初始组就不会在 /etc/group 文件中生成和用户名同名的组了
            不指定的话就会在 /etc/group 文件中生成一个和用户名同名的组 作为用户的初始组
        -G 组名 -- 指定用户的附加组 多个用逗号分割
            用这种方式指定用户附加组还会在 /etc/group 中生成和用户名同名的组
        -s shell  -- 手动指定用户的登陆shell

    用户默认值文件 添加用户时的默认值设置都在这里
        /etc/default/useradd
        /etc/login.defs

6. 用户管理命令 - passwd  设置用户密码
    passwd [选项] 用户名
        不加用户名表示给当前用户设置密码
        -S  -- 查询用户密码状态 仅 root 可用
        -l  -- 锁定用户
        -u  -- 解锁用户
        --stdin
        
7. 用户管理命令 - usermod & chage
    usermod [选项] 用户名
        -u UID  -- 修改用户的 UID
        -c 用户说明  -- 修改用户的说明信息
        -G 组名  -- 修改用户的附加组
        -L  -- 临时锁定用户
        -U  -- 解锁用户

    chage [选项] 用户名
        -l  -- 列出用户的详细密码状态

8. 用户管理命令
    删除用户
        userdel [-r] 用户名
            -r 删除用户的同时连同删除用户家目录

    切换用户身份
        su [选项] 用户名
            "-" 注意敲切换命令的时候一定要加这个 减号 不然切换不完全
        如 su - root 切换到 root
        如果只想用 root 身份执行一个命令 不想切换过去可以这样
            su - root -c "命令"

9. 用户管理命令 - 用户组管理
    添加用户组
        groupadd [选项] 组名
            -g GID  -- 指定组 id 不常用
    修改组 一般不建议改
        groupmod -n 新名 旧名
    删除组
        groupdel 组名
    已存在用户加入组或从组删除
        gpasswd 选项 组名
            -a 用户名  -- 把用户加入组
            -d 用户名  -- 把用户从组删除

/**
 * vim
 */ 
1. 文本编辑器 vim
    工作模式
        vi filename 进入 命令模式
        
        // 插入模式
        键入 [iao] 进入 插入模式
        ESC 退出 插入模式 到 命令模式
        
        // 编辑模式
        : 从 命令模式 进入 编辑模式
        回车 退出 编辑模式 到 命令模式
        
        // 退出
        :wq 保存退出

    常用操作
        :set nu  -- 设置行号
        :set nonu  -- 取消行号
        gg  -- 到第一行
        G  -- 到最后一行
        nG  -- 到第 n 行
        :n  -- 到第 n 行
        :w  -- 保存修改
        :w new_filename  -- 另存为指定文件
        :wq  -- 保存并退出
        :q!  -- 不保存退出
        :wq!  -- 强制保存退出 ( 文件所有者 root 可以执行 )
        
        dd  -- 删除光标所在的行
        dG  -- 删除光标到文件末尾的内容
        D  -- 删除光标到行尾内容
        :n1,n2d  -- 删除 n1 到 n2 行数据
        
        yy  -- 复制当前行
        dd  -- 剪切当前行
        p  -- 粘贴到光标处下一行
        
        u  -- 取消上一步操作
        
        /字符串  -- 搜索字符串
        n 查找下一个
        
    使用技巧
        :r 文件名  -- 导入一个文件内容到当前文件
        :map ctrl+v+键 内容<ESC>  -- 设置快捷键

/**
 * 权限管理
 */ 
1. ACL 权限 - 简介与开启
    忽略所有者所属组其他人这些权限 直接给一个用户分配某权限

    查看分区信息
        df -h
    查看分区 ACL 权限是否开启
        dumpe2fs -h 分区名
        -h  -- 仅显示超级块中信息
    临时开启分区 ACL 权限
        mount -o remount,acl 分区号  -- 重新挂载某分区 增加 acl 权限
    永久开启分区 ACL 权限
        1. 修改文件 
            vi /etc/fstab
        2. 重新挂载系统或者重启系统使修改生效
            mount -o remount 分区号

2. ACL 权限 - 查看与设定 ACL 权限
    查看 acl 权限
        getfacl 文件名
    设定 acl 权限
        setfacl 选项 文件名
        -m 设定 acl 权限
        -x 删除指定的 acl 权限
        -b 删除所有的 acl 权限
        -d 设定默认 acl 权限
        -k 删除默认 acl 权限
        -R 递归设定 acl 权限
    某目录给小明设置读执行权限
        setfacl -m u:xiaoming:rx /home/myproject

3. ACL 权限 - 最大有效权限与删除 acl 权限
    删除用户 acl 权限
        setfacl -x u:用户名 文件名
    删除用户组 acl 权限
        setfacl -x g:组名 文件名

4. ACL 权限 - 默认与递归 ACL 权限
    递归 ACL 权限 父目录在设置 ACL 权限时 所有子文件和子目录都拥有相同的 ACL 权限
        setfacl -m u:用户名:权限 -R 文件夹

    默认 ACL 权限 子文件和目录都会继承父目录的 ACL 权限
        setfacl -m d:u:用户名:权限 [-R] 文件夹
        
5. sudo 权限
    root 把本来只能超级用户执行的命令赋予普通用户执行
    配置文件为普通用户分配命令
        修改 /etc/sudoers 文件
            visudo
        文件说明
            root ALL=(ALL) ALL
                root  -- 用户名
                ALL=(ALL)  -- 被管理主机的地址=(何种身份 这块可省略)
                ALL  -- 授权命令
                例 赋予 sc 重启命令
                sc ALL=/sbin/shutdown -r now
            
            %wheel ALL=(ALL) ALL
                %xx  -- 组名
                ALL=(ALL)  -- 被管理主机的地址=(何种身份)
                ALL  -- 授权命令

    普通用户查看可用命令
        sudo -l
        
    普通用户执行命令
        sudo 命令

/**
 * 文件系统
 */
1. 分区类型
    主分区
        最多有四个
    扩展分区
        只能有一个 也算主分区一种
    逻辑分区

2. 常用命令
    统计目录或文件大小
        du [选项] [目录或文件名]
            -a 显示每个子文件的磁盘占用量
            -h 使用习惯单位显示磁盘占用量
            -s 统计总占用量
    文件系统修复 ( 一般不用 )
        fsck [选项] 分区设备文件名
    显示磁盘状态
        dumpe2fs 分区或设备文件名

3. 挂载
    查看系统已经挂载的设备
        mount [-l]
    根据配置文件 /etc/fstab 自动挂载
        mount -a
    挂载命令格式
        mount [tLo] 设备文件名 挂载点
            -t 文件系统
                iso9660  -- 光盘或光盘镜像
                ntfs  -- Windows NT ntfs 文件系统
            -L 卷标名
            -o 其他参数
        
4. 挂载光盘 光盘文件系统是 iso9660
    创建挂载点
        mkdir /mnt/cdrom  -- 这个目录用来挂载光盘
    挂载光盘
        mount -t iso9660 /dev/cdrom /mnt/cdrom
            /dev/cdrom 是 sr0 的软连接
        或者
        mount /dev/sr0 /mnt/cdrom
            sr0  -- 0 表示总线上的第一个 sr 设备 就是光驱
    卸载光盘
        umount 设备文件名或者挂载点

5. 挂载 U 盘
    查看 u 盘
        fdisk -l
    创建挂载点
        mkdir /mnt/usb
    挂载
        mount -t vfat /dev/sdb1 /mnt/usb/
    卸载

/**
 * linux 服务管理
 */
1. 服务分类
    RPM 包默认安装的服务 ( 默认服务 )
        独立服务
        基于 xinetd 服务
    源码包安装的服务

2. 服务启动与自启动
3. 查看系统安装的服务
    RPM 安装的服务和源码包安装的服务的区别就是安装位置不同
    查看所有 RPM 包安装的服务的自启动状态
        chkconfig --list
    修改服务自启动状态
        chkconfig  [--level 运行级别] 服务名 [on|off]
    查看源码包安装的服务
        不能用命令查询 只能手动去源码包安装目录看 源码包的服务一般都安装在指定位置 一般是 /usr/local/

    注
    linux 启动之后会在某一个级别运行
        0  -- 关机
        1  -- 单用户
        2  -- 不完全多用户
        3  -- 完全多用户状态 字符界面
        4  -- 系统保留 未分配
        5  -- 图形界面
        6  -- 重启
    /etc/inittab 保存了默认运行级别
        id:3:initdefault:

    每个运行级别对应系统中的一个文件夹
        0  -- /etc/rc0.d -> /etc/rc.d/rc0.d
            其实 /etc/rcN.d 是个链接文件 指向了 /etc/rc.d/rcN.d
        1  -- /etc/rc1.d -> /etc/rc.d/rc1.d
        2  -- /etc/rc2.d -> /etc/rc.d/rc2.d
        3  -- /etc/rc3.d -> /etc/rc.d/rc3.d
        4  -- /etc/rc4.d -> /etc/rc.d/rc4.d
        5  -- /etc/rc5.d -> /etc/rc.d/rc5.d
        6  -- /etc/rc6.d -> /etc/rc.d/rc6.d

    运行级别目录中含有一系列启动或停止服务的脚本
    表示这些服务需要在该级别下启动或停止

    在系统启动的过程中 将会启动一个名为 init 的进程
    它所要完成的一部分工作就是看看需要启动或停止哪些服务
    它通过查看 /etc/inittab 配置文件来得到当前运行级别
    进而可知需要进入哪个运行级别目录执行脚本

4. 独立服务管理
    RPM 服务安装的默认位置
        /etc/init.d/  -- 启动脚本位置
        /etc/sysconfig/  -- 初始化环境配置文件位置
        /etc/  -- 配置文件位置
        /etc/xinetd.conf/  -- xinetd 配置文件
        /etc/xinetd.d/  -- 基于 xinetd 服务的启动脚本
        /var/lib/  -- 服务产生的数据
        /var/log/  -- 日志文件

    RPM 独立服务的启动命令
        标准方式
        /etc/init.d/服务名 start|stop|status|restart
        或用简便方式
        service 服务名 start|stop|status|restart
        service 会搜索 /etc/init.d 目录 RPM 安装的软件的服务一般都放在这里
        
    独立服务器的自启动几种修改方式
        1. chkconfig  [--level 运行级别] 服务名 [on|off]
        2. 修改 etc/rc.d/rc.local 文件 推荐使用
            该文件中配置的服务会开机自启动
        3. 使用 ntsysv 命令以图形界面方式配置要自启动的服务

5. 基于 xinetd 服务管理
    安装 xinetd
        yum -y install xinetd
        
    基于 xinetd 的 telnet
    vi /etc/xinetd.d/telnet
    service telnet {  -- 服务的名称
        socket_type = stream  -- 使用 tcp 协议数据包
        wait = no  -- 允许多个连接同时连接
        user = root  -- 启动服务的用户为 root
        server = /usr/sbin/in.telnetd  -- 服务的启动程序
        log_on_failure += USERID  -- 登录失败后 记录用户 ID
        disable = no  -- 允许服务启动
    }
    修改完配置 启动 telnet 服务
    因为 telnet 服务是基于 xinetd 的 所以 我们要重启 xinetd 服务才能启动 telnet
    service xinetd restart

6. 源码包服务的管理
    使用绝对路径 调用启动脚本来启动
    如 /usr/local/apache2/bin/apachectl start|stop

/**
 * 访问控制
 */
linux 内核集成了网络访问控制功能 通过 netfilter 模块实现
linux 内核通过 netfilter 模块实现了网络访问控制 在用户层我们通过 iptables 对 netfilter 进行管理

netfilter 支持通过以下方式对数据包进行分类
    源 ip 地址
    目标 ip 地址
    使用接口
    使用协议 (tcp udp icmp)
    端口号
    连接状态

Netfilter
----------------------------------------
            |           tables
过滤点      |---------------------------
chain       |  filter |  nat  |  mangle
----------------------------------------
INPUT       |   yes   |       |   yes
FORWARD     |   yes   |       |   yes
OUTPUT      |   yes   |  yes  |   yes
PREROUTING  |         |  yes  |   yes
POSTROUTING |         |  yes  |   yes
----------------------------------------

规则
    数据包按照第一个匹配的规则执行相关动作 就不再去匹配其它规则

创建规则
    iptables [-t table] chain rule-specification [options]

    例子
    iptables -t filter -A INPUT -s 192.168.1.2 -j DROP
    参数
        -t  -- 指定使用的表
        -A  -- append 方式指定过滤点 (chain)
        
        -s  -- 指定源地址
        -d  -- 指定目标地址
        -p  -- 指定协议类型
        --sport  -- 指定源端口
        --dport  -- 指定目标端口
        
        -j  -- 匹配后的动作
        
/**
 * 备份 恢复
 */
1. 需要备份的数据
    /root/ 目录
    /home/ 目录
    /var/spool/mail/ 目录
    /etc/ 目录

2. 备份命令
    dump [选项] 备份后文件名 源文件或目录
        -levelnumber  -- 0-9 备份级别
        -f 文件名  -- 指定备份之后的文件名
        -u  -- 备份成功后 把时间记录在 /etc/dumpdates 文件
        -v  -- 显示备份过程中更多输出信息
        -j  -- 调用 bzlib 压缩备份文件
        -W  -- 显示被备份的分区的备份等级及备份时间
    例如备份 boot 分区
        dump -0uj -f /root/boot.bak.bz2 /boot/

3. 还原
    restore [模式选项] [选项]
        模式选项
            -C  -- 比较备份数据和实际数据的变化
            -i  -- 进入交互模式 手工选择要备份的文件
            -t  -- 查看模式 查看备份文件中有哪些数据
            -r  -- 还原模式 用于数据还原
        选项
            -f  -- 指定备份文件的文件名

/**
 * 日志管理
 */
1. 查看服务是否启动
    ps aux | grep rsyslogd
    grep rsyslogd

2. 常见日志作用
    /var/log/cron/  -- 系统定时任务相关日志
    /var/log/cups/  -- 打印信息日志
    /var/log/dmesg  -- 开机内核自检信息
    /var/log/btmp  -- 错误登录日志 需要使用 lastb 命令查看
    /var/log/lastlog -- 所有用户最后一次登录日志 需使用 lastlog 命令查看
    /var/log/mailog  -- 邮件日志
    /var/log/message  -- 系统重要信息日志
    /var/log/secure  -- 验证和授权方面的信息
    /var/log/wtmp  -- 永久记录用户登录注册信息
    /var/log/utmp  -- 当前已登录用户信息

    RPM 包的服务日志文件一般放在 /var/log/ 下
    源码包的服务日志文件一般安装在源码包指定位置

3. 日志文件格式
    事件产生时间
    发生事件的服务器的主机名
    产生时间的服务名或程序名
    事件的具体信息

4. /etc/rsyslog.conf 配置文件
    格式
        服务名[链接符号]日志等级  日志记录位置
        
5. 日志轮替
    日志文件命名规则
        如果配置文件中有 dateext 参数 那日志会用日期来作为日志文件的后缀
    /etc/logrotate.conf 配置文件
        daily  -- 日志轮替周期是一天
        weekly  -- 日志轮替周期是一周
        monthly  -- 日志轮替周期是一个月
        rotate 数字  -- 保留的日志文件个数
        compress  -- 日志轮替时 压缩旧日志
        create mode owner group  -- 建立日志同时指定权限
        mail address  -- 日志发送给某邮件
        missingok  -- 日志不存在 忽略警告信息
        notifempty  -- 日志为空 不进行日志轮替
        minsize 大小  -- 日志轮替最小值
        size 大小  -- 日志大于指定值进行轮替
        dateext  -- 日志后缀

/**
 * 系统管理
 */
1. 查看系统所有进程
    BSD 操作系统格式
        ps aux
    标准 Linux 格式
        ps -le
    结果 ( 不加 grep 过滤时会看到如下标题 )
        USER  -- 进程由哪个用户产生
        PID  -- 进程号
        CPU 
        MEM
        VSZ  -- 进程占用虚拟内存大小
        RSS  -- 进程占用实际内存大小
        TTY  -- 进程是在哪个终端中运行的
        STAT  -- 进程状态
        START  -- 进程启动时间
        TIME  -- 该进程占用 CPU 的时间
        COMMAND  -- 产生进程的命令名
        
    查看系统健康状态
        top [选项]
            -d 秒数  -- 更新频率
        top 结果前 5 行
        第一行任务队列信息
            12:26:20  -- 系统当前时间
            up 1 day, 13:32  -- 系统运行时间
            2 users  -- 当前登录了多少用户
            load average: 0.00, 0.00, 0.00  -- 系统在之前 1 分钟 5 分钟 15 分钟的平均负载
        第二行进程信息
            Task: 95 total  -- 系统中的进程数
            1 running  -- 正在运行的进程数
            92 sleeping  -- 睡眠进程
            0 stopped  -- 正在停止的进程
            0 zombie  -- 僵尸进程
        第三行 CUP 信息
        第四行物理内存信息
        第五行交换分区信息

2. 查看进程树
    pstree [选项]
        -p  -- 显示进程的 id 即 PID
        -u  -- 显示进程所属用户

3. 终止进程
    kill [-signalNo|signaName] processID
    使用 kill 命令时不带任何信号或名字意味着使用缺省的信号 15

    查看可用的进程信号
        kill -l  -- 这里是字母 l
    强制杀死进程
        kill -9 进程 id
    重启进程
        kill -1 进程 id  -- 这里是数字 1
    杀死进程
        killall [选项][信号] 进程名
            -i  -- 交互式 询问是否杀死某个进程
            -I  -- 忽略进程的大小写
        pkill [选项][信号] 进程名
            -t  -- 按终端号杀死进程

    信号说明
    信号      信号名     含义
    1       SIGHUP      挂起或父进程被杀死
    2       SIGINT      来自键盘的中断信号 通常是 <CTRL-C>
    3       SIGQUIT     从键盘退出
    9       SIGKILL     无条件终止
    11      SIGSEGV     段( 内存 )冲突
    15      SIGTERM     软件终止（缺省杀进程信号）

4. 工作管理
    把进程放入后台
        命令结尾加 & 符号  -- 放入后台后继续执行
        执行中按 ctrl + z  -- 放入后台后暂停
    查看后台工作
        jobs [-l]
            -l  -- 显示工作的 PID
    后台暂停的工作恢复到前台
        fg %工作号
            % 可以省略 但是注意工作号和 PID 的区别
    把工作恢复到后台
        bg %工作号

5. 系统资源查看
    监控系统资源
        vmstat [刷新延时 刷新次数]
    显示开机内核检测信息
        dmesg
    查看内存使用状态
        free [-bkmg]
            -b  -- 以字节为单位显示
            -k  -- 以 KB 为单位显示
            -m  -- 以 MB 为单位显示
            -g  -- 以 GB 为单位显示
    查看 CPU 信息
        cat /proc/cpuinfo
    查看系统与内核相关信息
        uname [选项]
            -a  -- 查看系统所有相关信息
            -r  -- 查看内核版本
            -s  -- 查看内核名称
    判断系统位数
        file /bin/ls

6. 系统定时任务
    linux 下的任务调度分为两类 系统任务调度 和 用户任务调度
        系统任务调度  -- 系统周期性所要执行的工作 /etc/crontab 文件就是系统任务调度的配置文件
        用户任务调度  -- 用户定期要执行的工作 所有用户定义的 crontab 文件都被保存在 /var/spool/cron 目录中 文件名与用户名一致
        
    权限
        /etc/cron.deny  -- 该文件中所列用户不允许使用 crontab 命令
        /etc/cron.allow  -- 该文件中所列用户允许使用 crontab 命令

    crond 服务是定时任务守护进程
        开启服务
            service crond restart
        检查是否开启
            chkconfig crond on

    crontab [选项]
        -e  -- 编辑 crontab 定时任务
        -l  -- 查询当前定时任务
        -r  -- 删除当前定时任务
    定时任务格式
        * * * * * 需要执行的命令
        星号
            第一个  -- 一小时中第几分钟 0 - 59
            第二个  -- 一天中第几个小时 0 - 23
            第三个  -- 一个月中第几天 1 - 31
            第四个  -- 一年中第几个月 1 - 12
            第五个  -- 一周中的星期几 0 - 7 (0 7 都表示星期天)
        特殊符号
            *  -- 代表任何时间
            ,  -- 代表不连续的时间
            -  -- 代表连续时间
            */n  -- 代表每隔多久执行一次

    例子
        10 20 * * * 命令  -- 在 20 点 10 分执行
        0 17 * * 1 命令  -- 每周 1 的 17 点的 0 分执行
        0 5 1,15 * * 命令  -- 每月 1 号和 15号 5 点 0 分执行
        40 4 * * 1-5 命令  -- 周一到周五 4 点 40 分执行
        */10 4 * * * 命令  -- 每天 4 点 每个 10 分钟执行一次
        
/**
 * shell
 */
一些文件
    /etc/profile
        System wide environment and startup programs
        当用户第一次登录时 该文件被执行 并从 /etc/profile.d 目录的配置文件中搜集 shell 的设置
        修改后需要重启才会生效
    ~/.bash_profile
        User specific environment and startup programs
        当用户登录时 该文件仅仅执行一次
        修改后需要重启才会生效

    /etc/bashrc
        System wide functions and aliases
        为每一个运行 bash shell 的用户执行此文件 当 bash shell 被打开时 该文件被读取
        修改后不需要重启就能生效
    ~/.bashrc
        User specific aliases and functions
        修改后不需要重启就能生效

1. 查看 linux 支持的 shell
    查看 /etc/shells 文件可能有如下可用 shell
    
    /bin/sh    ( 已经被 /bin/bash 所取代 )
    /bin/bash  ( linux 预设的 shell )
    /bin/tcsh  ( 整合 C Shell 提供更多的功能 )
    /bin/csh   ( 已经被 /bin/tcsh 所取代 )

2. shell 执行方式
    2.1 基本输出
        echo [选项] [输出内容]
            -e  -- 识别反转义字符
    2.2 执行脚本 2 种方式
        赋予脚本文件可执行权限 然后直接输入文件名
            chmod 755 hello.sh
            ./hello.sh  -- 直接写脚本名执行脚本时 必须写上脚本路径 不能直接写 hello.sh
        通过 bash 调用脚本
            bash hello.sh

3. bash 基本功能 - 历史命令
    history [选项] [历史命令保存文件]
        -c  -- 清空历史命令
        -w  -- 把缓存中的历史命令写入历史命令保存文件 ~/.bash_history

    历史命令的调用
        使用上下箭头
        使用 !n 执行第 n 条历史命令
        使用 !! 执行上一条命令
        使用 !字符串 执行最后一条以该字符串开头的命令

4. bash 基本功能 - 命令别名和快捷键
    查看命令的别名
        alias
    设定命令别名
        alias 别名="命令原名"
    在命令行中设置的别名只是临时生效的 要想永久生效需要修改用户对应文件
        /root/.bashrc
        /home/username/.bashrc
    删除别名
        unalias 别名
    快捷键
        ctrl + c  -- 终止当前命令
        ctrl + l  -- 清屏
        ctrl + U  -- 删除或剪切光标前的命令
        ctrl + D  -- 退出当前终端

5. bash 基本功能 - 输入输出重定向
    shell 是从左至右分析相应的命令的
    标准输入输出
        文件描述符
            0  -- 标准输入
            1  -- 标准输出
            2  -- 标准错误输出
    标准输出重定向
        命令 > 文件  -- 以覆盖方式 把命令的输出输出到指定的文件或设备中 
            命令 1> 文件 也是可以的
        命令 >> 文件  -- 以追加方式 把命令的输出输出到指定的文件或设备当中
            命令 1>> 文件 也是可以的
    标准错误输出重定向
        错误命令 2> 文件  -- 以覆盖方式输出
        错误命令 2>> 文件  -- 以追加方式输出
    正确输出和错误输出同时保存
        命令 > 文件 2>&1  -- 覆盖方式把正确输出和错误输出都保存到文件
            2>&1  -- 错误输出先保存到正确输出中 再把错误和正确输出都保存到文件中
        命令 >> 文件 2>&1  -- 追加方式把正确输出和错误输出都保存到文件
        
        命令 &> 文件  -- 覆盖方式把正确输出和错误输出都保存到文件
        命令 &>> 文件  -- 追加方式把正确输出和错误输出都保存到文件
        
        命令 >>文件1 2>>文件2  -- 追加方式 把正确输出保存到文件1 错误输出保存到文件2
    运行结果输出到垃圾箱
        命令 &>/dev/null

    输入重定向
        wc [选项] [文件名]
            -c  -- 统计字节数
            -w  -- 统计单词书
            -l  -- 统计行数

6. bash 基本功能 - 多命令顺序执行与管道符
    多命令顺序执行
        命令1; 命令2  -- 多个命令顺序执行 命令间没有任何逻辑挂链
        命令1 && 命令2  -- 逻辑与 命令1正确执行后命令2才执行
        命令1 || 命令2  -- 逻辑或 命令1执行不正确 命令2才执行
    管道符
        命令1 | 命令2  -- 命令1的正确输出作为命令2的操作对象
    grep 命令
        grep [选项] "搜索内容"
            -i  -- 忽略大小写
            -n  -- 输出行号
            -v  -- 反向查找
            --color=auto  -- 搜索出的关键字用颜色显示

7. bash 基本功能 - 通配符和其他特殊符号
    通配符
        ?  -- 匹配任意一个字符
        *  -- 匹配 0 个或 多个 字符
        []  -- 匹配中括号中任意一个字符
        [x1-x2]  -- 匹配中括号中某个范围内的任意一个字符
        [^xxx]  -- 匹配除了中括号外的任意字符
    其他特殊符号
        ''  -- 单引号 在引号中所有特殊符号都被认为没有特殊意义
        ""  -- 双引号 在引号中所有特殊符号都认为有特殊含义
        ``  -- 反引号 引号引起来的都是系统命令
        $()  -- 和反引号作用相同
        $  -- 用户调用变量的值
        #  -- 注释
        \  -- 转义符
        
8. bash 基本功能 - 变量
    查看所有变量
        set
    自定义变量
        变量名=变量值
    环境变量
    位置参数变量
    预定义变量

9. bash 基本功能 - 环境变量
    声明环境变量
        export 变量名=变量值
            export  -- 把变量声明为全局变量 所有 shell 中都可用
    查询变量
        evn
    删除变量
        unset 变量名
    修改环境变量
        PATH="$PATH":自定义路径

10. bash 基本功能 - 位置参数变量
    $n  -- n 是数字 $0 代表命令本身 $1-$9 代表第一到第九个参数
    $*  -- 代表命令行中所有参数 $* 把所有参数看做一个整体
    $@  -- 代表命令行中所有参数 $@ 把每个参数区别对待
    $#  -- 代表命令行中所有参数的个数

11. bash 基本功能 - 预定义变量
    $?  -- 最后一次执行命令的返回状态 结果为 0 表示命令执行成功
    $$  -- 当前进程号
    $!  -- 后台运行的最后一个进程的进程号

    接收键盘输入
    read [选项] [变量名]
        -p "提示信息"  -- 显示输入提示
        -t 秒数  -- 输入等待时间
        -n 字符数  -- 输入多少字符后执行
        -s  -- 隐藏输入的数据

12. bash 基本功能 - 声明变量类型
    declare [+|-][选项] 变量名
        -  -- 给变量设定类型属性
        +  -- 取消变量的类型属性
        
        -i  -- 变量声明为整数型
        -x  -- 变量声明为环境变量
        -p  -- 显示指定变量的被声明的类型

13. bash 基本功能 - 环境变量配置文件
    让配置文件强制生效 source 命令
    source 命令是 shell 的一个内部命令 它从指定的 shell 文件中读入所有命令语句并在当前进程中执行
        source 配置文件
        或者用
        . 配置文件
</pre>