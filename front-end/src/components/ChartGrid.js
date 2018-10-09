import React, { Component } from 'react'

import { Row, Col } from 'antd'

export default class ChartGrid extends Component {
  render () {
    const grids = []
    for (let i = 0; i < 36; i++) {
      grids.push(<Col style={styles.grid} key={i} span={4} />)
    }
    return (
      <Row style={styles.container} type='flex'>
        {grids}
      </Row>
    )
  }
}

const styles = {
  container: {
    borderStyle: 'dashed none dashed none',
    borderWidth: '1px',
    borderColor: '#e7e7eb',
    marginTop: 40,
    marginLeft: 40,
    marginRight: 40
  },
  grid: {
    height: '33px',
    borderStyle: 'dashed none dashed none',
    borderWidth: '1px',
    borderColor: '#e7e7eb'
  }
}