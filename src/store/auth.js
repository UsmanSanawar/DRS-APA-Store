
import RestService from "./restService/restService"

const initialState = {
    authUser: {
        access_token: "eyJhbGciOiJSUzI1Ni",
        expires_at: 1605246768,
        id_token: "eyJhbGciOiJSUzI1Ni",
        profile: {
            uId: '',
            customerGroupId: 2,
        }
    }
};

export default function authReducer(state = initialState, action) {

    switch (action.type) {

        case 'SIGNIN_USER_SUCCESS': {
            return { ...state, authUser: action.payload }
        }


        default:
            return state;
    }
}
