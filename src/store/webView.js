
const initialState = {
    storeView: false,
};

export default function quickviewReducer(state = initialState, action) {
    let newState = state;

   if(action.type === "STORE_VIEW"){
        newState = {
            ...state,
            storeView: action.storeView
        }
    }

    return newState;
}
