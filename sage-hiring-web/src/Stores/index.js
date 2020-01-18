import React, { createContext, useReducer, useContext } from 'react';

const defaultState = {
  mode: 'view',
  customers: [],
  customer: null,
  countCustomers: 0,
  loading: false,
};

const reducer = (state = defaultState, action = {}) => {
    switch (action.type) {
        case 'SWITCH_VIEW':
            const mode = state.mode === 'view' ? 'edit' : 'view';
            const customer = mode === 'view' ? null : { addresses: [{}] };
            return { ...state, mode , customer };
        case 'SWITCH_LOAD':
            return { ...state, loading: !state.loading };
        case 'FETCH_CUSTOMERS':
            return { ...state, customers: action.data, countCustomers: action.count || 0, loading: false,  };
        case 'CHANGE_CUSTOMER':
                return { ...state, customer: action.value };
        default:
            return state;
    }
}

const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, defaultState);
    const value = { state, dispatch };

    return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
