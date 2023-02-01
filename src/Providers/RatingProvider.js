import React, {useContext, useEffect, useReducer} from 'react';
import {callApi} from '.';
import {AuthContext} from './AuthProvider';

export const RatingContext = React.createContext();

export const ACTIONS = {
  OnFail: 'onFail',
  OnInit: 'onInit',
  Start: 'Start',
  OnStartSuccess: 'onStartSuccess',
  LoadMore: 'LoadMore',
  OnLoadMoreSuccess: 'onLoadMoreSuccess',
  Refresh: 'Refresh',
  OnRefreshSuccess: 'onRefreshSuccess',
};

const initalRatingData = [
  {ratingStars: '1', count: 0},
  {ratingStars: '2', count: 0},
  {ratingStars: '3', count: 0},
  {ratingStars: '4', count: 0},
  {ratingStars: '5', count: 0},
];

const initialState = {
  data: [],
  ratingData: initalRatingData,
  loading: true,
  refreshing: false,
  type: ACTIONS.OnInit,
  hasLoadedAllItems: false,
  pagecount: 0,
};

const reducer = (state, {type, payload}) => {
  switch (type) {
    case ACTIONS.OnFail:
      return {...state, loading: false, refreshing: false, type: ACTIONS.OnFail};
    case ACTIONS.OnInit:
      return initialState;
    case ACTIONS.Start:
      return {...initialState, loading: true, type: ACTIONS.Start};
    case ACTIONS.OnStartSuccess:
      return {
        ...state,
        loading: false,
        data: payload.data,
        ratingData:payload.ratingData,
        type: ACTIONS.OnStartSuccess,
        hasLoadedAllItems: payload.data.length < 10,
      };
    case ACTIONS.LoadMore:
      return {...state, pagecount: state.pagecount + 1, loading: true, type: ACTIONS.LoadMore};
    case ACTIONS.OnLoadMoreSuccess:
      return {
        ...state,
        loading: false,
        data: [...state.data, ...payload.data],
        type: ACTIONS.OnLoadMoreSuccess,
        hasLoadedAllItems: payload.data.length < 10,
      };
    case ACTIONS.Refresh:
      return {...state, pagecount: 0, refreshing: true, type: ACTIONS.Refresh};
    case ACTIONS.OnRefreshSuccess:
      return {
        ...state,
        refreshing: false,
        data: payload.data,
        ratingData:payload.ratingData,
        type: ACTIONS.OnRefreshSuccess,
        hasLoadedAllItems: payload.data.length < 10,
      };
    default:
      return state;
  }
};

const RatingProvider = ({children}) => {
  const {userData} = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => onStateChange(state), [state]);

  const onStateChange = async state => {
    console.log(state);
    if (state.type.includes('on')) return;
    let json = await callApi('reviewrating_list', userData.api_token, {user_id: userData.id, pagecount: state.pagecount});
    if (json) dispatch({type: `on${state.type}Success`, payload: json});
    else dispatch({type: ACTIONS.OnFail});
  };

  const acceptJob = async booking_id => await callApi('accept_job', userData.api_token, {user_id: userData.id, booking_id});
  const rejectJob = async booking_id => await callApi('reject_job', userData.api_token, {user_id: userData.id, booking_id});

  return <RatingContext.Provider value={{state, dispatch, acceptJob, rejectJob}}>{children}</RatingContext.Provider>;
};

export default RatingProvider;

const fakeCallApi = (subfix, AppKey, {pagecount}, onFalse, method = 'POST') => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({data: Data.slice(pagecount * 10, (pagecount + 1) * 10), ratingData : initalRatingData});
      //   resolve({data:[]})
    }, 100);
  });
};

let Data = [
  {
    userName: 'Donnie Smith',
    review: ` Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.`,
    rating: 4,
    userImage:
      'https://images.unsplash.com/photo-1520877880798-5ee004e3f11e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
    t: '29 july 2019',
    id: 1,
  },
  {
    userName: 'Donnie Smith',
    review: ` Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
    rating: 4,
    userImage:
      'https://images.unsplash.com/photo-1520877880798-5ee004e3f11e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
    t: '29 july 2019',
    id: 2,
  },
  {
    userName: 'Donnie Smith',
    review: ` Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
    rating: 4,
    userImage:
      'https://images.unsplash.com/photo-1520877880798-5ee004e3f11e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
    t: '29 july 2019',
    id: 3,
  },
  {
    userName: 'Donnie Smith',
    review: ` Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`,
    rating: 4,
    userImage:
      'https://images.unsplash.com/photo-1520877880798-5ee004e3f11e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
    t: '29 july 2019',
    id: 4,
  },
  {
    userName: 'Donnie Smith',
    review: ` Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
    rating: 4,
    userImage:
      'https://images.unsplash.com/photo-1520877880798-5ee004e3f11e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
    t: '29 july 2019',
    id: 5,
  },
  {
    userName: 'Donnie Smith',
    review: ` Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`,
    rating: 4,
    userImage:
      'https://images.unsplash.com/photo-1520877880798-5ee004e3f11e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
    t: '29 july 2019',
    id: 6,
  },
  {
    userName: 'Donnie Smith',
    review: ` Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`,
    rating: 4,
    userImage:
      'https://images.unsplash.com/photo-1520877880798-5ee004e3f11e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
    t: '29 july 2019',
    id: 7,
  },
  {
    userName: 'Donnie Smith',
    review: ` Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.`,
    rating: 4,
    userImage:
      'https://images.unsplash.com/photo-1520877880798-5ee004e3f11e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
    t: '29 july 2019',
    id: 11,
  },
  {
    userName: 'Donnie Smith',
    review: ` Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
    rating: 4,
    userImage:
      'https://images.unsplash.com/photo-1520877880798-5ee004e3f11e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
    t: '29 july 2019',
    id: 12,
  },
  {
    userName: 'Donnie Smith',
    review: ` Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
    rating: 4,
    userImage:
      'https://images.unsplash.com/photo-1520877880798-5ee004e3f11e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
    t: '29 july 2019',
    id: 13,
  },
  {
    userName: 'Donnie Smith',
    review: ` Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`,
    rating: 4,
    userImage:
      'https://images.unsplash.com/photo-1520877880798-5ee004e3f11e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
    t: '29 july 2019',
    id: 14,
  },
  {
    userName: 'Donnie Smith',
    review: ` Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
    rating: 4,
    userImage:
      'https://images.unsplash.com/photo-1520877880798-5ee004e3f11e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
    t: '29 july 2019',
    id: 15,
  },
  {
    userName: 'Donnie Smith',
    review: ` Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`,
    rating: 4,
    userImage:
      'https://images.unsplash.com/photo-1520877880798-5ee004e3f11e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
    t: '29 july 2019',
    id: 16,
  },
  {
    userName: 'Donnie Smith',
    review: ` Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`,
    rating: 4,
    userImage:
      'https://images.unsplash.com/photo-1520877880798-5ee004e3f11e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
    t: '29 july 2019',
    id: 17,
  },
];
