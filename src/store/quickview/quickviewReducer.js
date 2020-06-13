import { QUICKVIEW_CLOSE, QUICKVIEW_OPEN,STORE_VIEW } from './quickviewActionTypes';


const initialState = {
    open: false,
    product: null,
    storeView: false,
};

export default function quickviewReducer(state = initialState, action) {
    let newState = state;

    if (action.type === QUICKVIEW_OPEN) {
        newState = {
            ...state,
            open: true,
            product: JSON.parse(JSON.stringify(action.product)),
        };
    } else if (action.type === QUICKVIEW_CLOSE) {
        newState = {
            ...state,
            open: false,
        };
    }else if(action.type === STORE_VIEW){
        newState = {
            ...state,
            storeView: action.storeView
        }
    }

    return newState;
}
