const HOME_DATA_LOAD_SUCCESS = 'HOME_DATA_LOAD_SUCCESS';

export function loadHomeData() {
    return dispatch => {
        setTimeout(function(){
            var data = [
                {name: 'zhangsan', age: 20},
                {name: 'lisi', age: 30}
            ];
            dispatch({type: HOME_DATA_LOAD_SUCCESS, data: data});
        }, 3000);
    };
}