import React from 'react';
import ajax from 'xhr-plus';
import {
  Form, Select, Input, Button, Switch,
  Icon, Tooltip, Upload, message,
} from 'antd';
import { connect } from 'dva';
import BulkEditor from '../../components/bulk-editor';

import './style.less';

const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;
const Dragger = Upload.Dragger;

const BulkEditorAccounts = [{
  field: 'username',
  placeholder: '用户名',
  width: '',
}, {
  field: 'password',
  placeholder: '密码',
  width: '',
}, {
  field: 'remark',
  placeholder: '备注',
  width: '',
}];

const BulkEditorEnvs = [{
  field: 'value',
  placeholder: '例如 http://',
  width: '70%',
}, {
  field: 'remark',
  placeholder: '备注',
  width: '30%',
}];

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class Project extends React.Component {
  state = {
    ownersOption: [],
  }
  componentDidMount() {
    const { params: { projectId } } = this.props;
    // 获取应用下所有接口
    this.props.dispatch({
      type: 'projectSettingModel/getApis',
      projectId,
    });
    // 获取应用详情
    this.props.dispatch({
      type: 'projectSettingModel/project',
      projectId,
    });
  }

  handleSearchMembers(type, keyword) {
    if (keyword === '') {
      return;
    }

    if (this._timeout) {
      clearTimeout(this._timeout);
      this._timeout = null;
    }
    this._timeout = setTimeout(() => {
      ajax({
        url: '/api/search',
        method: 'get',
        type: 'json',
        data: { keyword },
      }).then(({ status, data }) => {
        if (status === 'success') {
          const newState = { ...this.state };
          newState[type + 'Option'] = data.users;
          this.setState(newState);
        }
      });

    }, 300);
  }

  handleSaveProject = () => {
    const { projectId } = this.props.params;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'projectSettingModel/projectUpdate',
          id: projectId,
          project: {
            desc: values.desc,
            name: values.name,
            owners: values.owners,
            envs: values.envs,
            accounts: values.accounts,
            smartDoc: values.smartDoc,
          },
        });
      }
    });
  }

  handleDeleteAPI = data => {
    this.props.dispatch({
      type: 'projectSettingModel/deleteAPI',
      apiId: data._id,
      projectId: data.projectId,
    });
  }

  smartDockDetail = () => {
    const uploadProps = {
      accept: '.json',
      name: 'swagger',
      action: '/openapi/sync/upload',
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    return (
      <Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <Icon type="inbox" />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
      </Dragger>
    );
  }

  render() {
    window._t_ = this;
    const { projectSettingModel, params } = this.props;
    const { project: { name, desc, owners, envs, accounts, smartDoc } } = projectSettingModel;
    const { projectId } = params;
    const { getFieldDecorator, getFieldError } = this.props.form;

    return (
      <div className="setting-page">
        <div className="form-content">
          <Form layout="vertical" hideRequiredMark={true}>
            {getFieldDecorator('_id', {
              initialValue: projectId,
            })(
              <Input type="hidden" />
            )}
            <FormItem
              label="名称"
              {...formItemLayout}
              help={getFieldError('name')}
            >
              {getFieldDecorator('name', {
                initialValue: name,
                rules: [{ required: true, message: '应用名称不能为空' }],
              })(
                <Input placeholder="请输入应用名称" />
              )}
            </FormItem>
            <FormItem
              label="描述"
              {...formItemLayout}
              help={getFieldError('desc')}
            >
              {getFieldDecorator('desc', {
                initialValue: desc,
              })(
                <Input placeholder="请输入应用描述" />
              )}
            </FormItem>
            <FormItem
              label="管理员"
              {...formItemLayout}
            >
              {getFieldDecorator('owners', {
                initialValue: owners,
                rules: [{ required: true, message: '管理员不能为空' }],
              })(
                <Select
                  mode="multiple"
                  notFoundContent=""
                  style={{ width: '100%' }}
                  placeholder="请选择管理员"
                  onSearch={keyword => { this.handleSearchMembers('owners', keyword); }}
                  filterOption={false}
                  labelInValue
                  optionLabelProp="name"
                >
                  {
                    this.state.ownersOption.map(item => (
                      <Option key={item.empId} value={item.empId} name={item.name}>
                        {item.avatar_url && <img className="option-user" src={item.avatar_url} width={30} height={30} alt="" />}
                        <span className="option-name">{item.name} - {item.username || item.empId}</span>
                      </Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
            <FormItem
              label="服务器URL"
              {...formItemLayout}
            >
              {getFieldDecorator('envs', {
                initialValue: envs && envs[0] ? envs : [{}],
              })(
                <BulkEditor configs={BulkEditorEnvs} />
              )}
            </FormItem>
            <FormItem
              label="测试账户"
              {...formItemLayout}
            >
              {getFieldDecorator('accounts', {
                initialValue: accounts && accounts[0] ? accounts : [{}],
              })(
                <BulkEditor configs={BulkEditorAccounts} />
              )}
            </FormItem>
            <Button className="submit" type="primary" size="default"
              htmlType="submit" onClick={this.handleSaveProject}>更新
            </Button>
          </Form>
        </div>
        <div className="smart-content">
          <Form layout="vertical" hideRequiredMark={true}>
            <h3 className="setting-sub-title">开启智能文档同步
              <Tooltip className="icon-tip" placement="topLeft" title="开启后支持多种自动同步方式, 如Swagger, 接口同步">
                <Icon type="question-circle" />
              </Tooltip>
            </h3>
            <FormItem
              {...formItemLayout}
            >
              {getFieldDecorator('smartDoc', {
                initialValue: smartDoc,
                valuePropName: 'checked',
              })(
                <Switch checkedChildren="开" unCheckedChildren="关" />
              )}
            </FormItem>
            { this.smartDockDetail() }
          </Form>
        </div>
      </div>
    );
  }
}

export default connect(({ projectSettingModel }) => {
  return {
    projectSettingModel,
  };
})(createForm()(Project));
