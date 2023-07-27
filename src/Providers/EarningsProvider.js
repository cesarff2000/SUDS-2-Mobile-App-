import React, { useContext, useEffect, useReducer, useState } from 'react';
import { callApi } from '.';
import { AuthContext } from './AuthProvider';

export const EarningContext = React.createContext();

export const EARNING_TYPES = { today: 'today', weekly: 'weekly' };

export const ACTIONS = {
    OnFail: 'onFail',
    OnInit: 'onInit',
    Start: 'Start',
    OnStartSuccess: 'onStartSuccess',
    LoadMore: 'LoadMore',
    OnLoadMoreSuccess: 'onLoadMoreSuccess',
    Refresh: 'Refresh',
    OnRefreshSuccess: 'onRefreshSuccess',
    ChangeEarningType: 'changeEarningType',
    OnChangeEarningTypeSuccess: 'onChangeEarningTypeSuccess',
};

const initialState = {
    data: [],
    totalbooking: '0',
    totaltime: '0m',
    totalamount: '0$',
    loading: true,
    refreshing: false,
    type: ACTIONS.OnInit,
    hasLoadedAllItems: false,
    pagecount: 0,
    earningType: EARNING_TYPES.today,
};

const reducer = (state, { type, payload, earningType }) => {
    switch (type) {
        case ACTIONS.OnFail:
            return { ...state, loading: false, refreshing: false, type: ACTIONS.OnFail };
        case ACTIONS.OnInit:
            return initialState;
        case ACTIONS.Start:
            return { ...initialState, loading: true, type: ACTIONS.Start };
        case ACTIONS.OnStartSuccess:
            return {
                ...state,
                loading: false,
                data: payload.data,
                totalamount: payload.totalamount,
                totaltime: payload.totaltime,
                totalbooking: payload.totalbooking,
                type: ACTIONS.OnStartSuccess,
                hasLoadedAllItems: payload.data.length < 10,
            };
        case ACTIONS.ChangeEarningType:
            return { ...initialState, loading: true, type: ACTIONS.ChangeEarningType, earningType: earningType };
        case ACTIONS.OnChangeEarningTypeSuccess:
            return {
                ...initialState,
                loading: false,
                type: ACTIONS.OnChangeEarningTypeSuccess,
                hasLoadedAllItems: payload.data.length < 10,
                data: payload.data,
            };
        case ACTIONS.LoadMore:
            return { ...state, pagecount: state.pagecount + 1, loading: true, type: ACTIONS.LoadMore };
        case ACTIONS.OnLoadMoreSuccess:
            return {
                ...state,
                loading: false,
                data: [...state.data, ...payload.data],
                totalamount: payload.totalamount,
                totaltime: payload.totaltime,
                totalbooking: payload.totalbooking,
                type: ACTIONS.OnLoadMoreSuccess,
                hasLoadedAllItems: payload.data.length < 10,
            };
        case ACTIONS.Refresh:
            return { ...state, pagecount: 0, refreshing: true, type: ACTIONS.Refresh };
        case ACTIONS.OnRefreshSuccess:
            return {
                ...state,
                refreshing: false,
                data: payload.data,
                totalamount: payload.totalamount,
                totaltime: payload.totaltime,
                totalbooking: payload.totalbooking,
                type: ACTIONS.OnRefreshSuccess,
                hasLoadedAllItems: payload.data.length < 10,
            };
        default:
            return state;
    }
};

const EarningProvider = ({ children }) => {
    const { userData } = useContext(AuthContext);
    const [state, dispatch] = useReducer(reducer, initialState);
    const [etype, setEType] = useState(0)

    useEffect(() => onStateChange(state), [state]);

    const onStateChange = async state => {
        if (state.type.includes('on')) return;
        let earningType = etype == 0 ? 'today' : ''
        let json = await callApi('earninglist', userData.api_token, { user_id: userData.id, pagecount: state.pagecount, type: earningType });
        if (json) dispatch({ type: `on${state.type}Success`, payload: { data: json.data, ...json } });
        else dispatch({ type: ACTIONS.OnFail });
    };

    const acceptJob = async booking_id => await callApi('accept_job', userData.api_token, { user_id: userData.id, booking_id });
    const rejectJob = async booking_id => await callApi('reject_job', userData.api_token, { user_id: userData.id, booking_id });

    return <EarningContext.Provider value={{ state, dispatch, acceptJob, rejectJob, setEType, onStateChange }}>{children}</EarningContext.Provider>;
};

export default EarningProvider;

const fakeCallApi = (subfix, AppKey, { pagecount }, onFalse, method = 'POST') => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({ data: Data.slice(pagecount * 10, (pagecount + 1) * 10) });
        }, 100);
    });
};

let Data = [
    {
        status: 'Done 01:25 pm, 10.03.2021',
        id: 1,
        dueAmount: '500 Rs',
        content: 'Headline of the featured training in view words',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
        like: '25',
        comment: '50',
    },
    {
        status: 'Started 10:25 am, 10.03.2021',
        id: 2,
        dueAmount: '500 Rs',
        content: 'Headline of the featured training in view words',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
        like: '25',
        comment: '50',
    },
    {
        status: 'Pending',
        id: 3,
        dueAmount: '500 Rs',
        content: 'Headline of the featured training in view words',
        image: 'https://images.unsplash.com/photo-1520877880798-5ee004e3f11e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
        like: '25',
        comment: '50',
    },
    {
        status: 'Pending',
        id: 4,
        dueAmount: '500 Rs',
        content: 'Headline of the featured training in view words',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
        like: '25',
        comment: '50',
    },
    {
        status: 'Pending',
        id: 5,
        dueAmount: '500 Rs',
        content: 'Headline of the featured training in view words',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
        like: '25',
        comment: '50',
    },
    {
        status: 'Pending',
        id: 6,
        dueAmount: '500 Rs',
        content: 'Headline of the featured training in view words',
        image: 'https://images.unsplash.com/photo-1520877880798-5ee004e3f11e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
        like: '25',
        comment: '50',
    },
    {
        status: 'Pending',
        id: 7,
        dueAmount: '500 Rs',
        content: 'Headline of the featured training in view words',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
        like: '25',
        comment: '50',
    },
    {
        status: 'Pending',
        id: 8,
        dueAmount: '500 Rs',
        content: 'Headline of the featured training in view words',
        image: 'https://images.unsplash.com/photo-1517836257463-d25dfeac3438?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
        like: '25',
        comment: '50',
    },
    {
        status: 'Done 01:25 pm, 10.03.2021',
        id: 11,
        dueAmount: '500 Rs',
        content: 'Headline of the featured training in view words',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
        like: '25',
        comment: '50',
    },
    {
        status: 'Started 10:25 am, 10.03.2021',
        id: 12,
        dueAmount: '500 Rs',
        content: 'Headline of the featured training in view words',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
        like: '25',
        comment: '50',
    },
    {
        status: 'Pending',
        id: 13,
        dueAmount: '500 Rs',
        content: 'Headline of the featured training in view words',
        image: 'https://images.unsplash.com/photo-1520877880798-5ee004e3f11e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
        like: '25',
        comment: '50',
    },
    {
        status: 'Pending',
        id: 14,
        dueAmount: '500 Rs',
        content: 'Headline of the featured training in view words',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
        like: '25',
        comment: '50',
    },
    {
        status: 'Pending',
        id: 15,
        dueAmount: '500 Rs',
        content: 'Headline of the featured training in view words',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
        like: '25',
        comment: '50',
    },
    {
        status: 'Pending',
        id: 16,
        dueAmount: '500 Rs',
        content: 'Headline of the featured training in view words',
        image: 'https://images.unsplash.com/photo-1520877880798-5ee004e3f11e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
        like: '25',
        comment: '50',
    },
    {
        status: 'Pending',
        id: 17,
        dueAmount: '500 Rs',
        content: 'Headline of the featured training in view words',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
        like: '25',
        comment: '50',
    },
    {
        status: 'Pending',
        id: 18,
        dueAmount: '500 Rs',
        content: 'Headline of the featured training in view words',
        image: 'https://images.unsplash.com/photo-1517836257463-d25dfeac3438?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
        like: '25',
        comment: '50',
    },
];
