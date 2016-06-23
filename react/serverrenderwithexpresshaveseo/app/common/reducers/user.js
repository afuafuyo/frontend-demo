/**
 * reducer
 */
const initialState = {
    tableData : {
        nowPage : 1,
        data: [
            /*{id: 1, name: 2, time: 3, type:4, views: 5}*/
        ]
    }
};

export default function(state = initialState, action) {
    switch(action.type) {
        case 1 :
            return Object.assign({}, state, {
                tableData: action.data
            });
            break;
        
        default:
            return state;
    }
    
    return state;
};