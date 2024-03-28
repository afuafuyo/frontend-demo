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

function indexOfBF2(str, sub) {
    // 存储主串位置
    let i = 0;
    // 存储子串位置
    let j = 0;
    
    // 主串 或者 子串查找完就推出
    while(i < str.length && j < sub.length) {
        // 依次匹配主串和子串
        if(str[i] === sub[j]) {
            i++;
            j++;
        } else {
            // 主串回溯到下一个字符
            // 子串从头开始
            i = i - j + 1;
            j = 0;
        }
    }
    
    if(j >= sub.length) {
        // 主串当前位置减去子串长度就是匹配开始的位置
        return i - sub.length;
    }
    
    return -1
}

console.log(indexOfBF2('aaabc', 'abc'))