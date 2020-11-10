
import RestService from "./restService/restService"

const initialState = {
    authUser: null,

};

export default function authReducer(state = initialState, action) {

    switch (action.type) {

        case 'SIGNIN_USER_SUCCESS':{
            return{...state, authUser: action.payload}
        }


        default:
            return state;
    }
}
