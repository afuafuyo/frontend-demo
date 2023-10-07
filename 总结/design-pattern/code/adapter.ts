interface TypeCPhone {
    name: string;
    charge(): void;
}
class AbstractPhone implements TypeCPhone {
    public name = '';

    charge(): void {
        console.log(this.name + '充电')
    }
}
class XiaoMi extends AbstractPhone {
    public name = '小米'
}

// == 不符合规范的手机
class IPhone {
    charge() {
        console.log('苹果充电')
    }
}



// 适配器实现标准接口 将处理过程中转到非标准设备
class IPhoneAdapter implements TypeCPhone {
    public name = 'iphone';
    public iphone: IPhone;

    constructor(iphone: IPhone) {
        this.iphone = iphone;
    }

    charge(): void {
        console.log(this.iphone.charge())
    }
}
// 充电设备只能提供 typec 接口
class Power {
    static supply(p: TypeCPhone) {
        p.charge()
    }
}

Power.supply(new XiaoMi())
Power.supply(new IPhoneAdapter(new IPhone()))
