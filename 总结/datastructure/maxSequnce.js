/**
 * 求最大游程问题
 *
 * 如 1 22 345 6666 78 999 最大游程为 4 （也就是最大连续数字序列为 4 ）
 */
function maxSequnce(str) {
    let next = -1;
    let current = str[0];
    let currentLength = 1;
    let maxLength = 1;

    for(let i=1; i<str.length; i++) {
        next = str[i];

        if(next === current) {
            currentLength += 1;
        } else {
            currentLength = 1;
        }
        // 这里 current 的赋值也可以写到上面 else 中
        // 当序列的值发生变化是才更新一下 current 也可以
        // 可以少一些赋值操作
        current = next;

        if(currentLength > maxLength) {
            maxLength = currentLength;
        }
    }

    return maxLength;
}

console.log(maxSequnce('122345666678999'))
