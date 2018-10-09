import React, { Component } from 'react'

import { Modal, Button } from 'antd'

import NoImg from '../assets/noImg.jpg'

const imgService = "/api/common/file/"

class ImageContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      width: '32px',
      height: '32px'
    }
    this.onClick = this.onClick.bind(this)
    this.onModalCancel = this.onModalCancel.bind(this)
  }
  onClick() {
    this.setState({ showModal: true })
  }
  onModalCancel() {
    this.setState({ showModal: false })
  }
  render() {
    const { width, height } = this.state
    let url = this.props.url
    const { showModal } = this.state
    url = !url ? NoImg : imgService + url
    return (
      <span style={styles.container}>
        <Modal visible={showModal} onCancel={this.onModalCancel} width={1000} footer={null} maskClosable={false}>
          <div style={{ padding: 20 }}>
            <div style={styles.bigPic}>
              <img src={url} style={{ width: '100%', height: 'auto' }} />
            </div>
          </div>
        </Modal>
        <img src={url} width={width} height={height} onClick={this.onClick} />
      </span>
    )
  }
}

const styles = {
  container: {
    cursor: 'pointer'
  },
  bigPic: {
    padding: '10px',
    textAlign: 'center'
  }
}

export default ImageContainer