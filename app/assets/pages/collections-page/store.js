import { message } from 'antd';
import { isBelong, getSpaceAlias } from '../../utils/utils';
import ajax from '../../utils/ajax';

export default {
  namespace: 'collectionsModel',
  state: {
    groups: [],
    collections: [],
    apis: [],
    filter: '',
    currentPage: 1,
    category: 'ME', // 1:ALL  2:ME
    showFolderModal: false,
    groupSelectVisible: false,
  },
  effects: {
    *collections({}, { call, put }) {
      try {
        const { status, data } = yield call(ajax, {
          url: '/api/collections',
          method: 'get',
          params: {
            spaceAlias: getSpaceAlias(),
          },
        });
        if (status === 'success') {
          // 判断如果属于个人的接口为空，默认定位到全部
          yield put({
            type: 'setData',
            data: {
              category: data.find(isBelong) ? 'ME' : 'ALL',
              collections: data,
              groups: data.filter(item => item.type === 'folder'),
            },
          });
        }
      } catch (e) {
        message.error(e.message || '查询接口集失败');
      }
    },
    *createFolder({ form, name, _id }, { call, put }) {
      try {
        yield call(ajax, {
          url: _id ? `/api/collections/${_id}` : '/api/collections',
          method: _id ? 'put' : 'post',
          data: {
            name,
            spaceAlias: getSpaceAlias(),
            type: 'folder',
          },
        });

        message.success(_id ? '更新成功' : '创建成功');
        yield put({
          type: 'setFolderModal',
          visible: false,
        });

        yield put({
          type: 'collections',
        });
        form.resetFields();
      } catch (e) {
        message.error(_id ? '更新失败' : '创建失败');
      }
    },
    *changeGroup({groupId, collectionId}, { call, put }) {
      try {
        yield call(ajax, {
          url: `/api/collections/${collectionId}`,
          method: 'put',
          data: {
            parentId: groupId,
          },
        });

        yield put({
          type: 'setData',
          data: {
            groupSelectVisible: false,
          },
        });

        yield put({
          type: 'collections',
        });
      } catch (e) {
        message.error(e.message || '移动失败');
      }
    },
  },

  reducers: {
    setData(state, { data }) {
      return { ...state, ...data };
    },
    filterFile(state, { filter }) {
      return { ...state, filter };
    },
    setCurrentPage(state, { currentPage }) {
      return { ...state, currentPage };
    },
    setFolderModal(state, { visible }) {
      return { ...state, showFolderModal: visible };
    },
  },
};
