var obj = {
    data: 1,
    next: {
        data: 2,
        next: {
            data: 3,
            next: {
                data: 4,
                next: null
            }
        }
    }
};

/**
 * 迭代法 （三个指针移动）
 */
function reverseLinkedList2(head) {
    let prev = null;
    let cur = head;
    let next = null;

    while(cur !== null){
        next = cur.next;

        cur.next = prev;

        // 指针前移
        prev = cur;
        cur = next;
    }

    // 最后 cur 为尾节点的 next 就是 null
    // prev 是尾节点
    return prev;
}

/**
 * 递归法
 */
function reverseLinkedList(head) {
    if(head.next === null) {
        return head;
    }

    // 一直递归到最后一个元素
    let last = reverseLinkedList(head.next);

    // 后一个节点指向前一个节点
    head.next.next = head;
    head.next = null;

    // 将尾节点返回
    return last;
}

let ret = reverseLinkedList(obj)
console.log(ret)
