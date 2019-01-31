import React from 'react';
import { Avatar, Icon, Dropdown, Menu } from 'antd';
import { Link } from 'dva/router';
import GlobalSearch from '../global-search';
import { setCookie } from '../../utils/utils';

import './style.less';

const user = window.context.user;
class Header extends React.Component {
  gotoHomePage() {
    setCookie('pickpost_home', '');
    location.href = '/';
  }

  render() {
    const { uplevel, title } = this.props;

    if (title) {
      return (
        <div className="header">
          <div className="header-row">
            <div className="backbtn" onClick={() => { history.back(); }}>
              <Icon type="left" />
            </div>
            <div className="page-title">
              <span>{title}</span>
            </div>
          </div>
        </div>
      );
    }

    const menu = (
      <Menu>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">1st menu item</a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">2nd menu item</a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">3rd menu item</a>
        </Menu.Item>
      </Menu>
    );

    return (
      <div className="header">
        <div className="header-logo">
          {
            uplevel && (
              <Link to={this.props.uplevel} className="backbtn">
                <Icon type="left" />
              </Link>
            )
          }
          <Link to="/collections" className="logo-tit">
            <svg width="37px" height="20px" viewBox="0 0 37 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
              <defs>
                <linearGradient x1="75.7401524%" y1="56.669876%" x2="0%" y2="0%" id="linearGradient-1">
                  <stop stopColor="#FC4D20" offset="0%"></stop>
                  <stop stopColor="#FE916D" offset="100%"></stop>
                </linearGradient>
                <linearGradient x1="25.9436619%" y1="66.0903456%" x2="100%" y2="3.27749649%" id="linearGradient-2">
                  <stop stopColor="#14C9A4" offset="0%"></stop>
                  <stop stopColor="#46E8C7" offset="100%"></stop>
                </linearGradient>
              </defs>
              <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="Logo" transform="translate(0.000000, 2.000000)">
                  <g id="Group-Copy-2">
                    <polygon id="Triangle-3" fill="#3C8DE7" transform="translate(34.339110, 6.699816) rotate(-218.000000) translate(-34.339110, -6.699816) " points="33.6037119 3.22046908 35.5941229 7.9348178 33.0840972 10.1791621"></polygon>
                    <polygon id="Triangle-Copy" fill="url(#linearGradient-1)" points="0.0729402709 7.0160731 8.39850688 12.571242 2.28378461 23.3524457"></polygon>
                    <polygon id="Triangle-2" fill="url(#linearGradient-2)" points="33.2489207 3.08836741 30.0178957 23.3856206 22.5958936 10.2762833"></polygon>
                    <polygon id="Triangle" stroke="#2C3E50" strokeWidth="1.5" points="16.1709741 0.0577115119 28.7955192 22.6383937 3.546429 22.6383937"></polygon>
                  </g>
                </g>
              </g>
            </svg>
            <span>PickPost</span>
          </Link>
        </div>
        <div>
          <Dropdown overlay={menu}>
            <div className="space-switch">
              口碑 <Icon type="down" />
            </div>
          </Dropdown>
          <div className="enter pull-right">
            <a className="help-link" onClick={this.gotoHomePage}>首页</a>
            <Avatar src={user.avatar} />
          </div>
          <div className="global-search pull-right">
            <GlobalSearch />
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
