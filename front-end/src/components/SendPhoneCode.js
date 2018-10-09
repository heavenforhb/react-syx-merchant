import React, { Component } from 'react'
import { Spin, notification } from 'antd'
import { connect } from 'dva'
import request from '../utils/request'

class SendPhoneCode extends Component {
    constructor(props) {
        super(props)
        this.state = {
            countDownTime: 60,
            loading: false,
            count: null
        }
    }

    componentWillUnmount() {
        clearTimeout(this.state.count)
    }

    getSMSCode() {
        const { smsType } = this.props
        this.setState({ loading: true })
        request('/api/user/sms/send', { method: 'POST', data: { smsType } })
        .then(response => {
            this.setState({ loading: false }) 
            notification.success({ message: '获取验证码成功' })
            this.countDown()
         })
        .catch(err => {
            notification.error({ message: err.Error })
            this.setState({ loading: false })
        })
    }

    countDown = () => {
        let { countDownTime } = this.state
        countDownTime--
        if (countDownTime > 0) {
           this.state.count = setTimeout(this.countDown, 1000)
        } else {
            countDownTime = 60
        }
        this.setState({ countDownTime })
    }

    render() {
        const { phoneNo } = this.props
        const { countDownTime, loading } = this.state
        return (
            <Spin spinning={loading}>
                <span>{phoneNo}</span>
                {countDownTime == '60' ? <a style={{ marginLeft: '50px' }} onClick={() => this.getSMSCode()}
                >获取短信验证码</a> : <span style={{ marginLeft: '50px' }}>{countDownTime +' ' + '秒'}</span>}
            </Spin>
        )
    }
}

function mapStateToProps(state) {
    const { baseInfoModal } = state.oprInfo
    return { baseInfoModal }
}

function mapDispatchToProps(dispatch) {
    return { dispatch }
}

export default connect(mapStateToProps)(SendPhoneCode)