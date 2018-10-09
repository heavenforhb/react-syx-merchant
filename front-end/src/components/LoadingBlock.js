import React, { Component } from 'react'


export default class extends Component {
  render () {
    return (
      <div>
        <p className='ant-card-loading-block' style={{width: '94%'}} />
        <p>
          <span className='ant-card-loading-block' style={{width: '28%'}} />
          <span className='ant-card-loading-block' style={{width: '62%'}} />
        </p>
        <p>
          <span className='ant-card-loading-block' style={{width: '22%'}} />
          <span className='ant-card-loading-block' style={{width: '66%'}} />
        </p>
        <p>
          <span className='ant-card-loading-block' style={{width: '56%'}} />
          <span className='ant-card-loading-block' style={{width: '39%'}} />
        </p>
        <p>
          <span className='ant-card-loading-block' style={{width: '21%'}} />
          <span className='ant-card-loading-block' style={{width: '15%'}} />
          <span className='ant-card-loading-block' style={{width: '40%'}} />
        </p>
      </div>
    )
  }
}