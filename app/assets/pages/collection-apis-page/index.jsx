import React from 'react';
import { connect } from 'dva';
import { Input, Menu, Dropdown, Button, Icon } from 'antd';
import { browserHistory, Link } from 'dva/router';
import Folder from '../../components/folder';
import ApiNav from './components/api-nav';
import FolderCreate from './components/folder-create';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import './style.less';

class Api extends React.PureComponent {
  componentDidMount() {
    const { params: { collectionId } } = this.props;

    this.props.dispatch({
      type: 'collectionApisModel/setData',
      payload: {
        collectionId,
      },
    });

    this.props.dispatch({
      type: 'collectionApisModel/getApisTree',
      collectionId,
    });

    this.handleFilterDebounced = e => {
      this.props.dispatch({
        type: 'collectionApisModel/changeKeywords',
        keywords: e.target.value,
      });
    };
  }

  handleMenuClick = e => {
    if (e.key === 'file') {
      const { location: { query }, collectionApisModel: { collectionId }} = this.props;

      browserHistory.push({
        pathname: '/api_fe/create',
        query: {
          collectionId,
          space: query.space,
        },
      });
    } else if (e.key === 'folder') {
      this.props.dispatch({
        type: 'collectionApisModel/setFolderModal',
        visible: true,
      });
    }
  }

  saveFormRef = formRef => {
    this.formRef = formRef;
  }

  handleCancel = () => {
    this.props.dispatch({
      type: 'collectionApisModel/setFolderModal',
      visible: false,
    });
  }

  handleCreateFolder = () => {
    const form = this.formRef.props.form;
    const { collectionId } = this.props.collectionApisModel;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      this.props.dispatch({
        type: values.folderId ? 'collectionApisModel/updateFolder' : 'collectionApisModel/createFolder',
        form,
        parentId: '',
        collectionId,
        name: values.name,
        folderId: values.folderId,
      });
    });
  }

  handleToggleCollection = (id, collapsed) => {
    const { collectionApis } = this.props.collectionApisModel;
    this.props.dispatch({
      type: 'collectionApisModel/setData',
      payload: {
        collectionApis: collectionApis.map(item => ({
          ...item,
          isCollapsed: item._id === id ? !!collapsed : !!item.isCollapsed,
        })),
      },
    });
  }

  handleToggleCollection = id => {
    const { location: { query }, collectionApisModel: { collectionId }} = this.props;
    // 跳转带分组信息的列表
    browserHistory.push({
      pathname: `/collection/${collectionId}/apis/list`,
      query: {
        groupId: id || 'none',
        space: query.space,
      },
    });
    this.groupId = id || 'none';
  }

  handleEditCollection = folder => {
    this.props.dispatch({
      type: 'collectionApisModel/setFolderModal',
      visible: true,
    });
    this.formRef.props.form.setFieldsValue({
      folderId: folder._id,
      name: folder.name,
    });
  }

  handleDeleteCollection = folderId => {
    this.props.dispatch({
      type: 'collectionApisModel/deleteFolder',
      folderId,
    });
  }

  handleAddFile = folder => {
    const { location: { query }, collectionApisModel: { collectionId }} = this.props;

    browserHistory.push({
      pathname: '/api_fe/create',
      query: {
        collectionId,
        groupId: folder._id,
        space: query.space,
      },
    });
  }

  handleApiChangeGroup = (apiId, groupId) => {
    this.props.dispatch({
      type: 'collectionApisModel/changeApiGroup',
      collectionApiId: apiId,
      groupId,
      currentGroupId: this.groupId,
    });
  }

  render() {
    const { collectionApisModel, collectionModel, params: { collectionId, apiId }, location: { query: { groupId, space }} } = this.props;
    const { filterApis, keywords, showFolderModal, collectionApis, folderId } = collectionApisModel;

    const showApis = keywords ? filterApis : collectionApis;
    const folder = {
      name: '默认接口',
      apis: collectionModel.apis,
    };

    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="file"><Icon type="plus-circle" theme="twoTone" />新增接口</Menu.Item>
        <Menu.Item key="folder"><Icon type="folder" theme="twoTone" />新增分组</Menu.Item>
      </Menu>
    );

    return (
      <div className="collection-apis-page">
        <div className="folder-tree">
          <div className="search-row">
            <Input placeholder="搜索分组" onChange={this.handleFilterDebounced} />
            <Dropdown overlay={menu} placement="bottomRight">
              <Button className="dropdown-btn" type="dashed">
                <Icon className="add-entrance" type="plus-circle" theme="twoTone" />
                <Icon className="dropdown-icon" type="caret-down" />
              </Button>
            </Dropdown>
          </div>
          <Link
            to={`/collection/${collectionId}/apis/list`}
            query={{ space }}
            className={ !groupId ? 'all-apis active' : 'all-apis'}
          >
            <Icon type="bars" />
            全部接口
          </Link>
          {
            showApis.map(folder => (
              <Folder
                key={folder._id}
                folder={folder}
                isActive={(folder._id && groupId && (this.groupId === folder._id || groupId === folder._id)) || (groupId === 'none' && !folder._id)}
                isCollapsed={folder.isCollapsed}
                handleToggleFolder={this.handleToggleCollection}
                handleEditFolder={this.handleEditCollection}
                handleDeleteFolder={this.handleDeleteCollection}
                handleAddFile={this.handleAddFile}
                handleSetFolder={this.handleSetFolder}
                handleApiChangeGroup={this.handleApiChangeGroup}
              />
            ))
          }
        </div>
        <div className="api-main">
          {
            apiId && <ApiNav groupId={this.groupId} apiId={apiId} collectionId={collectionId} {...this.props} />
          }

          {this.props.children}
        </div>
        <FolderCreate
          wrappedComponentRef={this.saveFormRef}
          folderId={folderId}
          visible={showFolderModal}
          onCancel={this.handleCancel}
          onCreate={this.handleCreateFolder}
        />
      </div>
    );
  }
}

export default connect(({ collectionModel, collectionApisModel }) => {
  return {
    collectionApisModel,
    collectionModel,
  };
})(DragDropContext(HTML5Backend)(Api));
