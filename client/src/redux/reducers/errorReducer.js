const initialErrorState = {
    globalError: null,
  };
  
  export function ErrorReducer(state = initialErrorState, action) {
    switch (action.type) {
      case 'SET_GLOBAL_ERROR':
        return {
          ...state,
          globalError: action.payload,
        };
      default:
        return state;
    }
  }
  