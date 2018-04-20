/**
 * The HashObject class is the base class for all other objects
 */
export default class HashObject {

    constructor() {
        this.hashCode = HashObject._hashCode++;
    }

}

HashObject._hashCode = 0;
