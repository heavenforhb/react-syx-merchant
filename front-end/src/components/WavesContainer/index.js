import React, { Component } from 'react'
import styles from './index.less'

class WavesContainer extends Component {
  constructor(props) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }
  onClick(e) {
    if (!this.refs.container) return false
    const { container } = this.refs
    const boundingRect = container.getBoundingClientRect()
    let mouseCLX = e.clientX, mouseCLY = e.clientY, 
      offsetX = mouseCLX - boundingRect.x, offsetY = mouseCLY - boundingRect.y
    
    this.addWave(offsetX, offsetY)
  }
  addWave(x, y) {
    if (!this.refs.wavesWrap) return false
    const { wavesWrap } = this.refs
    const div = document.createElement('div')
    div.className = styles.wavesItem
    div.style.left = (x - 300) + 'px'
    div.style.top = (y - 300) + 'px'
    wavesWrap.appendChild(div)
    div.addEventListener('webkitAnimationEnd', () => {
      wavesWrap.removeChild(div)
    })
  }
  render() {
    const { children } = this.props
    return (
      <div className={styles.container} onClick={this.onClick} ref="container">
        <div className={styles.children}>{ children }</div>
        <span ref="wavesWrap" className={styles.wavesWrap} />
      </div>
    )
  }
}

export default WavesContainer