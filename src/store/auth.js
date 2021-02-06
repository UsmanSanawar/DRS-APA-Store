

const initialState = {
  authUser: {
    access_token: "eyJhbGciOiJSUzI1Ni",
    expires_at: 1605246768,
    id_token: "eyJhbGciOiJSUzI1Ni",
  },
  profile: {
          customerId: null,
          customerGroupId: null,
        },
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case "SIGNIN_USER_SUCCESS": {
      console.log(action.payload, 'action.payload')
      return {
        ...state,
        profile: {
          customerId: action.payload.customerId,
          customerGroupId: action.payload.customerGroupId,
        },
      };
    }

    default:
      return state;
  }
}
