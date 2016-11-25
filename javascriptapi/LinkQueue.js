/**
 * 链队列
 *
 * var list = new LinkQueue();
 * list.put({xxx});
 * list.put({yyy});
 * list.take();
 */
function LinkQueue() {
    this.headNode = null;
    this.tailNode = null;
    this.size = 0;
    
    this.headNode = this.tailNode = new LinkQueue.Node(null, null);
}
LinkQueue.prototype = {
    constructor: LinkQueue
    ,size: function() {
        return this.size;
    }
    ,take: function() {
        // 为空直接返回
        if(this.headNode === this.tailNode) {
            return null;
        }
        
        // 队列中头节点
        var tmpHeadNode = this.headNode.next;
        var data = tmpHeadNode.data;
        
        // 从队列去除头节点
        this.headNode.next = tmpHeadNode.next;
        tmpHeadNode.next = null;
        
        // 没节点了 重置 tail
        if(null === this.headNode.next) {
            this.tailNode = this.headNode;
        }
        
        tmpHeadNode = null;
        this.size--;
        
        return data;
    }
    ,put: function(data) {
        var node = new LinkQueue.Node(data, null);
        // 队尾指向新节点
        this.tailNode.next = node;
        // 重新指定尾节点
        this.tailNode = node;
        // 计数
        this.size++;
    }
    ,toString: function() {
        var str = '[ ', current;
        for(current = this.headNode.next; null !== current; current = current.next) {
            str += current.data.toString() + ' ';
        }
        
        return str + ' ]';
    }
};
LinkQueue.Node = function(data, next) {
    this.data = data;
    this.next = next;
}
