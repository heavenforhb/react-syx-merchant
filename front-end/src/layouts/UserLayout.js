import React from 'react'
import PropTypes from 'prop-types'
import { Link, Route, Redirect, Switch } from 'dva/router'
import DocumentTitle from 'react-document-title'
import { connect } from 'dva'

class UserLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object
  }
  getChildContext() {
    const { location } = this.props
    return { location }
  }
  getPageTitle() {
    const { getRouteData, location } = this.props
    const { pathname } = location
    let title = '商银信支付'
    getRouteData('UserLayout').forEach((item) => {
      if (item.path === pathname) {
        title = `${item.name} - 商银信支付`
      }
    })
    return title
  }
  render() {
    const { getRouteData } = this.props

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div style={{ width: '100%', height: '100%' }}>
          {
            getRouteData('UserLayout').map(item =>
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
        </div>
      </DocumentTitle>
    )
  }
}

export default UserLayout
