import React, { createContext, useReducer, useContext } from 'react';

const defaultState = {
  mode: 'list',
  customers: [],
  customer: null,
  requestCustomers: true,
  offset: 0,
  rowPerPage: 12,
  countCustomers: 0,
  loading: false,
};

const reducer = (state = defaultState, action = {}) => {
    switch (action.type) {
        case 'SWITCH_VIEW':
            const mode = action.value || 'list';
            const customer = mode === 'list' ? null : { addresses: [{}] };
            const requestCustomers = mode === 'list';
            return { ...state, mode, customer, requestCustomers };
        case 'REQUEST_CUSTOMERS':
            return { ...state, requestCustomers: true };
        case 'FETCH_CUSTOMERS':
            return { ...state, customers: action.data, countCustomers: action.count || 0, requestCustomers: false,  };
        case 'NEXT_PAGE':
            const nOffset = state.offset + state.rowPerPage;
            return { ...state, offset: nOffset < state.countCustomers ? nOffset : state.countCustomers - 1, requestCustomers: true };
        case 'PREV_PAGE':
            const pOffset = state.offset - state.rowPerPage;
            return { ...state, offset: pOffset > 0 ? pOffset : 0, requestCustomers: true };
        case 'FETCH_CUSTOMER':
            return { ...state, customer: action.value, mode: 'view' };
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
