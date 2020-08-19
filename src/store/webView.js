
const initialState = {
    storeView: false,
    menu: []
};

export default function quickviewReducer(state = initialState, action) {
    let newState = state;

   if(action.type === "STORE_VIEW"){
        newState = {
            ...state,
            storeView: action.storeView,
            menu: state.menu
        }
    }


    if(action.type === "SAVE_WEB_MENU"){
        let dataList = action.data.sort((a, b) => a.order - b.order)
        newState = {
            ...state,
            menu: dataList,
            storeView: state.storeView
        }
    } 

    return newState;
}
