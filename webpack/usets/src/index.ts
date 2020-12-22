import Lib from './mod/Lib';

export default class Index {
    static DEMO = 1;

    public age = 10;

    public todo() {
        let msg = new Lib().test();

        console.log(msg);
    }
}


