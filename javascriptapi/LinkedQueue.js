/**
 * 链队列
 *
 * var list = new LinkedQueue();
 * list.put({xxx});
 * list.put({yyy});
 * list.take();
 */
function LinkedQueue() {
    this.headNode = null;
    this.tailNode = null;
    this.size = 0;
    
    this.headNode = this.tailNode = new LinkedQueue.Node(null, null);
}
LinkedQueue.prototype = {
    constructor: LinkedQueue
    
    /**
     * 返回队列大小
     */
    ,size: function() {
        return this.size;
    }
    
    /**
     * 返回队列头
     */
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
    
    /**
     * 入队列
     *
     * @param Object data 数据
     */
    ,put: function(data) {
        var node = new LinkedQueue.Node(data, null);
        // 队尾指向新节点
        this.tailNode.next = node;
        // 重新指定尾节点
        this.tailNode = node;
        // 计数
        this.size++;
    }
    
    /**
     * toString
     */
    ,toString: function() {
        var str = '[ ', current;
        for(current = this.headNode.next; null !== current; current = current.next) {
            str += current.data.toString() + ' ';
        }
        
        return str + ' ]';
    }
};
LinkedQueue.Node = function(data, next) {
    this.data = data;
    this.next = next;
}
