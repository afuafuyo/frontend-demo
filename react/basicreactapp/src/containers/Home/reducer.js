const initialState = {
    loading: true,
    data: null
};

export default function HomeReducer(state = initialState, action) {
    switch('todo') {
        case '1':
            return {
                loading: false,
                data: []
            };
        default:
            return state;
    }
}
