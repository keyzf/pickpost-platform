import React from 'react';
import ajax from 'xhr-plus';
import { string } from 'prop-types';
import { Icon } from 'antd';
import { Link } from 'dva/router';
import { ApiTypes as API_TYPES } from '../../../common/constants';

export default class ApiNav extends React.Component {
  static propTypes = {
    groupId: string,
    apiId: string,
    source: string, // 需求 - collection  应用 - project
    uniqueId: string,
  }

  static defaultProps = {
    groupId: '',
  }

  state = {
    apiDetail: {},
  }

  componentDidMount() {
    const { params } = this.props;
    if (params && params.apiId) {
      ajax({
        url: `/api/apis/${params.apiId}`,
        method: 'get',
        type: 'json',
      }).then(res => {
        if (res.status === 'success') {
          this.setState({
            apiDetail: res.data,
          });
        }
      });
    }
  }

  renderModules() {
    const { uniqueId, apiId, source } = this.props;
    const { apiDetail: { apiType } } = this.state;
    const apiTypeConfig = API_TYPES.find(v => v.type === apiType) || {};
    const supportModules = apiTypeConfig.supportModules || [];
    return (
      <div>
        { supportModules.includes('doc') && <Link to={`/${source}/${uniqueId}/apis/doc/${apiId}`} activeClassName="active">
          <Icon type="profile" /> 文档
        </Link> }
        { supportModules.includes('test') && <Link to={`/${source}/${uniqueId}/apis/test/${apiId}`} activeClassName="active">
          <Icon type="rocket" /> 测试
        </Link> }
        { supportModules.includes('mock') && <Link to={`/${source}/${uniqueId}/apis/mock/${apiId}`} activeClassName="active">
          <Icon type="api" /> Mock
        </Link>}
        { supportModules.includes('setting') && <Link to={`/${source}/${uniqueId}/apis/setting/${apiId}`} activeClassName="active">
          <Icon type="setting" /> 设置
        </Link>}
      </div>
    );
  }

  render() {
    const { uniqueId, groupId, source } = this.props;
    return (
      <div>
        <div className="tabs-header">
          <Link to={`/${source}/${uniqueId}/apis/list?groupId=${groupId}`} activeClassName="active">
            <Icon type="left" /> 返回列表
          </Link>
          <div className="split-line"></div>
          {
            this.renderModules()
          }
        </div>
      </div>
    );
  }
}
