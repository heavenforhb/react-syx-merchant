import React, { Component } from 'react'

import { Row, Col, Table } from 'antd'

class Detail extends Component {
  static defaultProps = {
    divider: 3
  }
  render() {
    const tableColumns = [{
      title: 'key',
      key: 'key',
      dataIndex: 'key',
      width: 180,
      render: text => {
        return <span style={{ color: '#999' }}>{text}</span>
      }
    }, {
      title: 'val',
      key: 'val',
      dataIndex: 'val'
    }]
    const { detail, divider } = this.props
    return (
      <div style={{ backgroundColor: '#eee' }}>
        {/* {rows} */}
        <Table rowClassName={(record, idx) => idx % 2 ? 'my-table__row-odd' : 'my-table__row-even'}
          showHeader={false}
          columns={tableColumns} dataSource={detail}
          pagination={false} bordered={false} scroll={{ y: 400 }}
          />
      </div>
    )
  }
}

export default Detail