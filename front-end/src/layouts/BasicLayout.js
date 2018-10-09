import React from 'react'
import PropTypes from 'prop-types'
import DocumentTitle from 'react-document-title'
import { Layout, Menu, Icon, Spin, notification, Dropdown } from 'antd'
import { connect } from 'dva'
import { Link, Route, Redirect, Switch, routerRedux } from 'dva/router'
import Debounce from 'lodash-decorators/debounce'
import { ContainerQuery } from 'react-container-query'

import Exception from '../components/Exception' // 403页面

const { Header, Sider, Content } = Layout

import classNames from 'classnames'

import styles from './BasicLayout.less'

const logo = require('../assets/logo-light.png')

const { SubMenu } = Menu

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200
  }
}

import request from '../utils/request'

class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object
  }

  constructor(props) {
    super(props)
    this.menus = (props.navData.reduce((arr, current) => arr.concat(current.children), [])).filter(item => item.name != '工单')
    this.state = {
      openKeys: this.getDefaultCollapsedSubMenus(props),
      isAllowed: true
    }
  }

  getChildContext() {
    const { location, navData, getRouteData } = this.props
    const routeData = getRouteData('BasicLayout')
    const firstMenuData = navData.reduce((arr, current) => arr.concat(current.children), [])
    const menuData = this.getMenuData(firstMenuData, '')
    const breadcrumbNameMap = {}

    routeData.concat(menuData).forEach((item) => {
      breadcrumbNameMap[item.path] = item.name
    })
    return { location, breadcrumbNameMap }
  }

  getMenuData = (data, parentPath) => {
    let arr = []
    data.forEach((item) => {
      if (item.children) {
        arr.push({ path: `${parentPath}/${item.path}`, name: item.name })
        arr = arr.concat(this.getMenuData(item.children, `${parentPath}/${item.path}`))
      }
    })
    return arr
  }

  componentDidMount() {
    const { userAuthenticated, dispatch, currentUser } = this.props
    if (userAuthenticated) {
      const { mercCd, oprCd } = currentUser
      dispatch({ type: 'user/fetch', payload: { mercCd, oprCd } })
      dispatch({ type: 'user/merchantBaseInfo', payload: { mercCd, caVisible: 'Y' } })
    } else {
      dispatch(routerRedux.replace('/user/login'))
    }
  }

  componentWillReceiveProps(nextProps) {
    const { userAuthenticated, dispatch } = nextProps
    if (!userAuthenticated) {
      dispatch(routerRedux.replace('/user/login'))
    }
  }

  onMenuClick({ key }) {
    if (key == 'logout') {
      this.props.dispatch({ type: 'user/update', payload: { authenticated: false } })
    }
    if(key == 'user') {
      this.props.dispatch(routerRedux.replace('/account/oprInfo'))
    }
    if(key == 'setting') {
      this.props.dispatch(routerRedux.replace('/workSheet'))
    }
  }

  getDefaultCollapsedSubMenus(props) {
    const currentMenuSelectedKeys = [...this.getCurrentMenuSelectedKeys(props)]
    currentMenuSelectedKeys.splice(-1, 1)
    if (currentMenuSelectedKeys.length === 0) {
      return ['dashboard']
    }
    return currentMenuSelectedKeys
  }

  getCurrentMenuSelectedKeys(props) {
    const { location: { pathname } } = props || this.props
    const keys = pathname.split('/').slice(1)
    if (keys.length === 1 && keys[0] === '') {
      return [this.menus[0].key]
    }
    return keys
  }

  getNavMenuItems(menusData, parentPath = '') {
    if (!menusData) {
      return []
    }
    return menusData.map((item) => {
      if (!item.name) {
        return null
      }
      let itemPath
      if (item.path.indexOf('http') === 0) {
        itemPath = item.path
      } else {
        itemPath = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/')
      }
      if (item.children && item.children.some(child => child.name)) {
        if (item.display !== undefined && item.display === false) {
          return false
        }
        return (
          <SubMenu
            title={
              item.icon ? (
                <span>
                  <Icon type={item.icon} />
                  <span>{item.name}</span>
                </span>
              ) : item.name
            }
            key={item.key || item.path}
          >
            {this.getNavMenuItems(item.children, itemPath)}
          </SubMenu>
        )
      }
      const icon = item.icon && <Icon type={item.icon} />
      return (
        <Menu.Item key={item.key || item.path}>
          {
            /^https?:\/\//.test(itemPath) ? (
              <a href={itemPath} target={item.target}>
                {icon}<span>{item.name}</span>
              </a>
            ) : (
                <Link
                  to={itemPath}
                  target={item.target}
                  replace={itemPath === this.props.location.pathname}
                >
                  {icon}<span>{item.name}</span>
                </Link>
              )
          }
        </Menu.Item>
      )
    })
  }

  getPageTitle() {
    const { getRouteData, location } = this.props
    const { pathname } = location
    let title = '商银信支付'
    getRouteData('BasicLayout').forEach((item) => {
      if (item.path === pathname) {
        title = `${item.name} - 商银信支付`
      }
    })
    return title
  }

  handleOpenChange = (openKeys) => {
    const lastOpenKey = openKeys[openKeys.length - 1]
    const isMainMenu = this.menus.some(
      item => lastOpenKey && (item.key === lastOpenKey || item.path === lastOpenKey)
    )
    this.setState({
      openKeys: isMainMenu ? [lastOpenKey] : [...openKeys]
    })
  }

  toggle = () => {
    const { collapsed } = this.props
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: !collapsed
    })
    this.triggerResizeEvent()
  }
  @Debounce(600)
  triggerResizeEvent() { // eslint-disable-line
    const event = document.createEvent('HTMLEvents')
    event.initEvent('resize', true, false)
    window.dispatchEvent(event)
  }

  onCollapse = (collapsed) => {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed
    })
  }

  render() {
    const { currentUser, getRouteData, collapsed, userAuthenticated, currentUserLoading, dispatch } = this.props

    const menuProps = collapsed ? {} : {
      openKeys: this.state.openKeys
    }

    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick.bind(this)}>
        <Menu.Item key='user'><Icon type="user" />个人中心</Menu.Item>
        <Menu.Item key='setting'><Icon type="setting" />工单</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />退出登录
        </Menu.Item>
      </Menu>
    )

    const layout = (
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="md"
          onCollapse={this.onCollapse}
          width={256}
          className={styles.sider}
        >
          <div className={styles.logo}>
            <Link to="/">
              <img src={logo} alt="logo" />
              <h1>商银信支付</h1>
            </Link>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            {...menuProps}
            onOpenChange={this.handleOpenChange}
            selectedKeys={this.getCurrentMenuSelectedKeys()}
            style={{ margin: '16px 0', width: '100%' }}
          >
            {this.getNavMenuItems(this.menus)}
          </Menu>
        </Sider>
        <Layout>
          <Header className={styles.header}>
            <Icon
              className={styles.trigger}
              type={collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
            <div className={styles.right}>
              <Spin spinning={currentUserLoading}>
                <Dropdown overlay={menu}>
                  <span className={`${styles.action} ${styles.account}`}>
                    <Icon type="user" /> {currentUser ? currentUser.oprName : ''} <Icon type="down" />
                  </span>
                </Dropdown>
              </Spin>

            </div>
          </Header>
          <Content style={{ margin: '24px 24px 0', height: '100%' }}>
            <div style={{ minHeight: 'calc(100vh - 260px)' }}>
              {
                this.state.isAllowed ? <Switch>
                  {
                    getRouteData('BasicLayout').map(item =>
                      (
                        <Route
                          exact={item.exact}
                          key={item.path}
                          path={item.path}
                          component={item.component}
                        />
                      )
                    )
                  }
                  <Redirect exact from="/" to={userAuthenticated ? '/home' : '/user/login'} />
                </Switch> : <Exception type="403" style={{ minHeight: 500, height: '80%' }} linkElement={Link} />
              }
            </div>
          </Content>
          <div className={styles.footer}>
            Copyright <Icon type="copyright" /> 2017 商银信支付
          </div>
        </Layout>
      </Layout>
    )
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

function mapStateToProps(state) {
  console.log('state:', state)
  return {
    currentUser: state.user.info,
    currentUserLoading: state.user.loading,
    userAuthenticated: state.user.authenticated,
    collapsed: state.global.collapsed
  }
}

function mapDispatchToProps(dispatch) {
  return { dispatch }
}

export default connect(mapStateToProps, mapDispatchToProps)(BasicLayout)
