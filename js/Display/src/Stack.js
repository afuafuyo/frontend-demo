/**
 * Stack
 */
export default class Stack {

    constructor() {
        this.headNode = null;
        this.tailNode = null;
        this.size = 0;
    }

    push(data) {
        var node = new XDom.StackNode(data, null, null);

        if(0 === this.size) {
            this.headNode = node;

        } else {
            this.tailNode.next = node;
            node.prev = this.tailNode;
        }

        this.tailNode = node;

        this.size++;
    }

    pop() {
        var ret = this.tailNode.data;

        if(0 === this.size) {
            return null;
        }
        if(1 === this.size) {
            this.headNode = this.tailNode = null;
            this.size--;

            return ret;
        }

        this.tailNode = this.tailNode.prev;
        this.tailNode.next.prev = null;
        this.tailNode.next = null;
        this.size--;

        return ret;
    }

    tail() {
        return null === this.tailNode ? null : this.tailNode.data;
    }

    clear() {
        while(0 !== this.size) {
            this.pop();
        }
    }

    toString() {
        var str = '[ ';

        for(var current = this.headNode; null !== current; current = current.next) {
            str += current.data + ' ';
        }

        return str + ' ]';
    }

}

class StackNode {
    constructor(data, prev, next) {
        this.data = data;
        this.prev = prev;
        this.next = next;
    }
}
