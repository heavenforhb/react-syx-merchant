import React, { Component } from 'react'

const charArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', ',']

import { equal } from '../../utils/utils'

class NumberScroller extends Component {
  static defaultProps = {
    size: 22,
    number: 0
  }

  constructor(props) {
    super(props)
    this.state = {
      number: 0
    }
  }

  componentWillReceiveProps(nextProps) {
    let tmpNumber = ('' + nextProps.number)
    const tmpArr = tmpNumber.split('').map(item => charArr.indexOf(item) <= 9 ? '0' : item)
    this.setState({ number: tmpArr.join('') }, () => {
      setTimeout(() => {
        this.setState({ number: tmpNumber })
      }, 10)
    })
  }

  componentDidUpdate () {
    this.scroll()
  }

  scroll() {
    const refs = this.refs
    Object.keys(refs).map(key => {
      const ref = refs[key]
      let transform = ref ? ref.getAttribute('data-trans') : ''
      transform && (ref.style.transform = transform)
    })
  }
  
  render () {
    let { size } = this.props
    const { number } = this.state
    const numArr = charArr.map((item, idx) => (
      <div key={`num${idx}`}>{item}</div>
    ))

    const numWrapArr = ('' + number).split('').map((item, idx) => {
      let charIdx = charArr.indexOf(item)
      return (
        <div key={idx} style={Object.assign({}, styles.container, {
          width: size * 0.52,
          transform: charIdx > 9 ? `translateY(-${charIdx * size}px)` : '',
          transition: `${charIdx <= 9 ? charIdx * 300 : 0}ms`
        })} ref={'wrap' + idx} data-trans={charIdx <= 9 ? `translateY(-${charIdx * size}px)` : ''}>{numArr}</div>
      )
    })

    return (
      <label>
        <div style={Object.assign({}, styles.container, {
          height: size,
          lineHeight: size + 'px',
          fontSize: size,
          color: '#111'
        })}>
          {numWrapArr}
        </div>
      </label>
    )
  }
}

const styles = {
  container: {
    display: 'inline-block',
    position: 'relative',
    verticalAlign: 'top',
    overflow: 'hidden'
  },
  wrap: {
    position: 'relative',
    float: 'left',
    textAlign: 'center',
    top: '0'
  }
}

export default NumberScroller
