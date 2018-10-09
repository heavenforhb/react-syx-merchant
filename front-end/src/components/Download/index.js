import React, { Component } from 'react'
import { notification, Progress } from 'antd'
import { connect } from 'dva'
import request from '../../utils/request'

class DownloadComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            count: 2,
            time: null,
            countRound: null
        }
    }

    componentDidMount () {
        this._isMounted = true
        this.download()
    }

    componentWillMount () {
        this._isMounted = false
    }

    componentWillUnmount() {
        clearTimeout(this.state.time)
        clearTimeout(this.state.countRound)
    }

    download = () => {
        const { query, madeFileUrl, downloadUrl, cancel, dispatch } = this.props
        delete query.pageNumber
        delete query.pageSize
        request(madeFileUrl, { data: query }).then(exportKey => {
            this.setState({ count: 50 }, () => { this.countDown() })
            let queryFun = () => { request(downloadUrl, { data: { exportKey } }).then(res => {
                if(res.status == 'fail') {
                    notification.error({ message: '生成excel失败，请重试' })
                    clearTimeout(this.state.time)
                    cancel()
                } else if(res.status == 'success') {
                    notification.success({ message: '生成excel成功' })
                    cancel()
                    clearTimeout(this.state.time)
                    this.setState({ count: 100 })
                    res.download.map(item => {
                        let a = document.createElement('a')
                        a.href = item
                        a.download = ''
                        a.target = '_blank'
                        document.body.appendChild(a)
                        a.click()
                    })
                } else {
                    this.state.time = setTimeout(queryFun,1000)
                }
            }).catch(err => {
                notification.error({ message: err.message })
                cancel()
            }) }
            queryFun()
        })
        .catch(error => {
            if(error.number == '401') {
                dispatch({ type: 'user/update', payload: { authenticated: false } })
            }
            notification.error({ message: 'Excel文件生成失败' })
            cancel()
        })
      }

    countDown = () => {
        let { count } = this.state
        count ++
        if (count < 99) {
            this.state.countRound = setTimeout(this.countDown, 1000)
        } else {
            count = 99
        }
        this.setState({ count })
    }
    
    render() {
        return (
            <div style={{ padding: 20 }}>
                <p style={{ paddingBottom: 20 }}>Excel文件已经开始生成，稍后将自动进行下载，若未能自动下载请更换Chrome浏览器重试</p>
                <Progress percent={this.state.count} showInfo={false} />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return { dispatch }
}

export default connect(mapStateToProps)(DownloadComponent)