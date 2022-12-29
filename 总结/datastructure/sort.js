/**
 * 相邻两个元素依次比较 大的往后交换
 *
 * 复杂度 O(n^2)
 * 冒泡排序是一种稳定排序算法
 */
class BubbleSort {
    sort(arr) {
        // 每冒泡一次 待排序元素个数就减少一个
        // 外层控制比较的范围
        for(let i=arr.length-1; i>0; i--) {
            for(let j=0; j<i; j++) {
                if( arr[j] > arr[j+1] ) {
                    this.exchange(arr, j, j+1);
                }
            }
        }
    }

    exchange(arr, i, j) {
        let t = arr[i];
        arr[i] = arr[j];
        arr[j] = t;
    }
}


/**
 * 每次找出最小元素索引 然后将最小元素放到最前面
 *
 * 复杂度 O(n^2)
 * 选择排序是不稳定的排序算法
 */
class SelectionSort {
    sort(arr) {
        // 每次循环 开头会多一个最小元素 待排序元素个数就减少一个
        // 最外层到最后一个元素其实就不用排了（因为前面每轮都找出最小元素 最后位置的元素肯定是最大的了） 所以是 length-1 当然写成 i<arr.length 也没问题
        for(let i=0; i<arr.length-1; i++) {
            let minIndex = i;
            // 找出待排序元素的最小索引
            for(let j=i+1; j<arr.length; j++) {
                if( arr[minIndex] > arr[j] ) {
                    minIndex = j;
                }
            }

            this.exchange(arr, i, minIndex);
        }
    }

    exchange(arr, i, j) {
        let t = arr[i];
        arr[i] = arr[j];
        arr[j] = t;
    }
}


/**
 * 分为左右两部分 左边为有序 右边无序 依次将右边元素插入到左边有序列表中
 *
 * 复杂度 O(n^2)
 * 插入排序是稳定的
 *
 * 核心算法部分为 比较以及交换 所以比较和交换的次数就为算法复杂度
 * 最坏情况下 每个相邻元素都需要比较 并且 都需要交换
 * 第一轮循环比较 1 次 第二次比较 2 次 以此类推 = 1 + 2 + 3 + ... + (N-1) = n^2/2 - n/2
 * 交换也是一样
 * 总共为 (n^2/2 - n/2)*2 = n^2-n = O(n^2)
 */
class InsertionSort {
    sort(arr) {
        // 控制右边未排序部分
        for(let i=1; i<arr.length; i++) {
            // 跟左边的元素比较 进行插入操作
            for(let j=i; j>0; j--) {
                // 由于左边是有序列表
                // 所以如果待插入的元素 比 有序列表最后一个都大 那就无需进行插入操作了
                if(arr[j] >= arr[j-1]) {
                    break;
                }

                this.exchange(arr, j, j-1);
            }
        }
    }

    exchange(arr, i, j) {
        let t = arr[i];
        arr[i] = arr[j];
        arr[j] = t;
    }
}


/**
 * 选定一个分界值对序列进行分割 将比分界值小的元素放到左边 比分界值大的放到右边
 *
 * 不稳定算法
 */
class QuickSort {
    sort(arr) {
        let low = 0;
        let high = arr.length - 1;

        this.sortPartition(arr, low, high);
    }

    // 对部分元素进行排序
    sortPartition(arr, low, high) {
        if(high <= low) {
            return;
        }

        let index = this.split(arr, low, high);

        // 让左半部分有序
        this.sortPartition(arr, low, index-1);

        // 让右半部分有序
        this.sortPartition(arr, index+1, high);
    }

    // 对某部分元素进行分组 返回分界元素索引
    split(arr, low, high) {
        // 选定分界值
        let key = arr[low];

        // 定义两个指针 分别指向待分割元素最小索引 和 最大索引
        let left = low;
        let right = high;

        // 下面可以优化 为了可读性 分开写了
        while(true) {
            // 从右向左移动 right 指针 找到比分界值小的元素（不找相等的 相等时没必要交换位置） 停止
            while(true) {
                if(right <= left) {
                    break;
                }

                // 2 4 6
                if(arr[right] < key) {
                    break;
                }

                right--;
            }

            // 从左向右移动 left 指针 找到一个比分界值大的元素 停止
            while(true) {
                if(left >= right) {
                    break;
                }

                // 5 3 1
                if(arr[left] > key) {
                    break;
                }

                left++;
            }

            // left >= right 要退出循环 否则交换元素
            if(left >= right) {
                break;

            } else {
                this.exchange(arr, left, right);
            }
        }

        // 最后 将分界值 和 结束时索引位置的值交换
        this.exchange(arr, low, right);

        // 或 return left;
        return right;
    }

    exchange(arr, i, j) {
        let t = arr[i];
        arr[i] = arr[j];
        arr[j] = t;
    }
}

// test
// let arr = [6, 7, 6, 2, 8, 1];
// let arr = [4, 3, 4, 12, 10, 4, 10, 5, 6];
// let arr = [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
let arr = [4, 1, 3, 5, 2, 8];
let sort = new QuickSort();


console.time();
sort.sort(arr);
console.timeEnd();

console.log(arr.toString());
