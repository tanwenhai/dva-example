import * as usersService from '../services/users';
import queryString from 'query-string';

export default {
  namespace: 'users',
  state: {
    list: [],
    total: null,
    page: 1,
  },
  reducers: {
    save (state, { payload: { data: list, total, page } }) {
      return { ...state, list, total, page };
    },
  },
  effects: {
    * fetch ({ payload: { page } }, { call, put }) {
      page = +page;
      const { data, headers } = yield call(usersService.fetch, { page });
      yield put({ type: 'save', payload: { data, total: +headers['x-total-count'], page } });
    },
    * remove ({ payload: id }, { call, put, select }) {
      yield call(usersService.remove, id);
      const page = yield select(state => state.users.page);
      yield put({ type: 'fetch', payload: { page } });
    },
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      return history.listen(({pathname, search}) => {
        const query = queryString.parse(search);
        if (pathname === '/users') {
          dispatch({ type: 'fetch', payload: query });
        }
      });
    },
  },
};

