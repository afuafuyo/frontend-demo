const initialState = {
    loading: true,
    data: null
};

export default function HomeReducer(state = initialState, action) {
    switch(action.type) {
        case 'HOME_DATA_LOAD_SUCCESS':
            // return Object.assign({}, state, {loading: false, data: action.data});
            return {
                loading: false,
                data: action.data
            };
        default:
            return state;
    }
}
