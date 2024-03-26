/**
 * 查找字串 BF 算法
 * thisisafineday, isa => 4
 */
function indexOfBF(str, sub) {
    if(str.length < sub.length) {
        return -1;
    }

    let pos = -1;
    // 比较需要花费的次数
    let count = str.length - sub.length;
    let matched = true;
    for(let i=0; i<=count; i++) {
        matched = true;
        for(let j=0; j<sub.length; j++) {
            // 这里不匹配的话 就会从头重新匹配
            // 这种现象叫做回溯 效率较低
            if(str[i+j] !== sub[j]) {
                matched = false;
                break;
            }
        }
        if(matched) {
            pos = i;
            break;
        }
    }
    return pos;
}

console.log(indexOfBF('abc', 'abc'))