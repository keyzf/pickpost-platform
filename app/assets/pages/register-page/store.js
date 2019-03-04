import { message } from 'antd';
import ajax from '../../utils/ajax';

export default {
  namespace: 'registerModel',
  state: {},
  effects: {
    *register({ email, password }, { call }) {
      try {
        yield call(ajax, {
          url: '/api/register',
          method: 'post',
          data: {
            email,
            password,
          },
        });

        // 注册成功，自动跳转登录界面
        location.href = '/login';
      } catch (err) {
        message.error(err.message || '系统异常');
      }
    },
  },
  reducers: {
    setData(state, { data }) {
      return { ...state, ...data };
    },
  },
};
