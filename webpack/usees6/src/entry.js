import hello from './mymodule';

class Entry {
    constructor() {
        console.log('entry');
    }
}

hello();
new Entry();
