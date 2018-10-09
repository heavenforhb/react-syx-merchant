import React, { Component } from 'react'
import { Card, Input, Row, Col, Select, Button, Divider, Table, Icon, Spin, Menu, Modal, Tooltip, DatePicker } from 'antd'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout'
import { connect } from 'dva'
import styles from './index.less'

import moment from 'moment'

import CopyToClipboard from 'react-copy-to-clipboard'

import { MERCHANT_STATUS, AGENT_MERCHANT_TYPE } from '../../../common/constants'

import { formatTime } from '../../../utils/utils'

import DownloadComponent from '../../../components/Download'

const { RangePicker } = DatePicker

class CopyComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
    }
  }

  toggle() {
    if (!this.state.visible) {
      let _this = this
      this.setState({ visible: !this.state.visible }, () => {
        setTimeout(() => {
          _this.setState({ visible: !this.state.visible })
        }, 1000)
      })
    }
  }

  render() {
    const { visible } = this.state
    const url = 'apply.allscore.cn' + '?' + this.props.url
    return (
      <div style={{ textAlign: 'center', padding: '30px' }}>
        <span style={{ fontSize: '16px', display: 'block', marginBottom: 20 }}>点击该链接进行复制，发送给商户进行商户申请</span>
        <span style={{
          width: 500,
          display: 'block',
          wordBreak: 'break-all',
          height: 80,
          backgroundColor: '#f3f3ff',
          padding: 20,
          margin: '0 auto',
          borderRadius: 5
        }}> <CopyToClipboard text={url}>
            <Tooltip title='复制成功' trigger='click' visible={visible} onVisibleChange={() => this.toggle()}>
              <span style={{ cursor: 'pointer' }}>{url}</span>
            </Tooltip>
          </CopyToClipboard></span>
      </div>
    )
  }
}

class MerchantList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      query: {
        page: 1,
        size: 10,
        mercCd: '',
        mercName: '',
        phoneNo: '',
        mercSts: '',
        mercType: '',
        agentCd: props.currentUser.mercCd
      },
      downloadModal: false,
      addMercModal: false
    }

  }

  componentDidMount() {
    this.refresh()
    this.getUrl()
  }

  refresh = () => {
    const { dispatch, loading } = this.props
    if (loading) return false
    dispatch({ type: 'merchantList/fetch', payload: this.state.query })
  }

  getUrl = () => {
    const { dispatch, loading } = this.props
    if (loading) return false
    dispatch({ type: 'merchantList/getUrl', payload: null })
  }

  queryChange = (key, val) => {
    const tmpObj = { page: 1 }
    tmpObj[key] = val
    // 修改交易类型时充值业务类型
    if (key == 'tranType') tmpObj['busType'] = ''
    this.setState({ query: Object.assign({}, this.state.query, tmpObj) })
  }

  setDateRange = (range) => {
    let beginDate = null, endDate = null

    if (typeof range == 'number') {
      beginDate = moment().subtract(range, 'days'), endDate = moment()
    } else {
      beginDate = range[0], endDate = range[1]
    }

    this.setState({ query: Object.assign({}, this.state.query, { beginDate, endDate }) }, this.refresh)
  }

  render() {
    const colProps = {
      xs: 24,
      md: 12,
      lg: 8,
      style: {
        marginBottom: '24px'
      }
    }

    const columns = [{
      title: '商户名称',
      dataIndex: 'mercName',
      key: 'mercName',
    }, {
      title: '商户编号',
      dataIndex: 'mercCd',
      key: 'mercCd',
    }, {
      title: '商户手机号',
      dataIndex: 'phoneNo',
      key: 'phoneNo'
    }, {
      title: '商户状态',
      dataIndex: 'mercSts',
      key: 'mercSts',
    }, {
      title: '申请时间',
      dataIndex: 'creTime',
      key: 'creTime',
    }]

    const { query, downloadModal, addMercModal } = this.state
    const { total, list, loading, dispatch, url } = this.props

    const tablePagination = {
      total: total,
      current: query.page,
      pageSize: query.size,
      onChange: page => {
        this.setState({ query: Object.assign({}, query, { page }) }, this.refresh)
      }
    }

    return (
      <PageHeaderLayout
        title="商户列表"
      >
        <Modal visible={downloadModal} width={800} destroyOnClose={true} maskClosable={false} onCancel={() => this.setState({ downloadModal: false }) } title='订单详情' footer={null}>
          <DownloadComponent query={query} madeFileUrl={'/api/download/merchantList/madeFile'} downloadUrl={'/api/download/merc/createUrl'} cancel={() => this.setState({ downloadModal: false })} />
        </Modal>
        <Modal visible={addMercModal} width={800} destroyOnClose={true} maskClosable={false} onCancel={() => this.setState({ addMercModal: false }) } title='订单详情' footer={null}>
          <CopyComponent url={url} />
        </Modal>
        <Card bordered={false} title="查询条件">
          <Row gutter={24}>
            <Col {...colProps} className={styles.col}>
              <span className={styles.inputLabel}>商户名称：</span>
              <Input className={styles.inputBox} placeholder="请输入商户名称"
                onChange={({ target: { value } }) => this.queryChange('mercName', value)} />
            </Col>
            <Col {...colProps} className={styles.col}>
              <span className={styles.inputLabel}>商户编号：</span>
              <Input className={styles.inputBox} placeholder="请输入商户商户编号"
                onChange={({ target: { value } }) => this.queryChange('mercCd', value)} />
            </Col>
            <Col {...colProps} className={styles.col}>
              <span className={styles.inputLabel}>商户手机号：</span>
              <Input className={styles.inputBox} placeholder="请输入商户手机号"
                onChange={({ target: { value } }) => this.queryChange('phoneNo', value)} />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col {...colProps} className={styles.col}>
              <span className={styles.inputLabel}>商户状态：</span>
              <Select className={styles.select} value={query.mercSts} onChange={val => this.queryChange('mercSts', val)}>
                <Select.Option value=''>全部</Select.Option>
                {Object.keys(MERCHANT_STATUS).map(key => <Select.Option value={key} key={key}>{MERCHANT_STATUS[key]}</Select.Option>)}
              </Select>
            </Col>
            <Col {...colProps} className={styles.col}>
              <span className={styles.inputLabel}>商户类型：</span>
              <Select className={styles.select} value={query.mercType} onChange={val => this.queryChange('mercType', val)}>
                <Select.Option value=''>全部</Select.Option>
                {Object.keys(AGENT_MERCHANT_TYPE).map(key => <Select.Option value={key} key={key}>{AGENT_MERCHANT_TYPE[key]}</Select.Option>)}
              </Select>
            </Col>
          </Row>
          <Divider style={{ marginTop: 0 }} dashed={true} />
          <Row style={{ textAlign: 'right' }}>
            <Button type="primary" icon="search" onClick={this.refresh} loading={loading}>查询</Button>
            <a target='_blank' className={'xs-hide'} style={{ marginLeft: 20 }} >
              <Button type="primary" icon="plus" onClick={() => this.setState({ addMercModal: true })}>新增商户</Button>
            </a>
            <a target='_blank' className={'xs-hide'} style={{ marginLeft: 20 }} >
              <Button type="default" icon="download" onClick={() => this.setState({ downloadModal: true })}>下载结果</Button>
            </a>
          </Row>
        </Card>
        <Card bordered={false} title="查询结果" style={{ marginTop: '24px', minHeight: '420px' }} >
          <Row>
            <Col xs={0} md={0} lg={24}>
              <Table columns={columns} dataSource={(list || []).map((item, idx) => {
                const { creDt, creTm, mercSts, mercCd, mercName, phoneNo } = item
                return Object.assign({}, item, {
                  key: idx,
                  creTime: formatTime(creDt, creTm),
                  mercSts: MERCHANT_STATUS[mercSts],
                  mercCd,
                  mercName,
                  phoneNo
                }
              )})} loading={loading} pagination={tablePagination} />
            </Col>
            <Col xs={24} md={24} lg={0}>
              <Table columns={[
                {
                  title: '商户编号',
                  dataIndex: 'mercCd',
                  key: 'mercCd',
                  width: '30%',
                  render: (text) => {
                    return <span key='orderNo' style={{ display: 'block', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{text}</span>
                  }
                },
                {
                  title: '商户状态',
                  dataIndex: 'mercSts',
                  key: 'mercSts'
                },
                {
                  title: '申请时间',
                  dataIndex: 'creTime',
                  key: 'creTime'
                }
              ]} dataSource={(list || []).map((item, idx) => {
                const { creDt, creTm, mercSts, mercCd } = item
                return {
                  key: idx,
                  creTime: formatTime(creDt, creTm),
                  mercSts: MERCHANT_STATUS[mercSts],
                  mercCd
                }
              })} loading={loading} pagination={tablePagination} />
            </Col>
          </Row>
        </Card>
      </PageHeaderLayout>
    )
  }
}

function mapStateToProps(state) {
  const { loading, list, total, url } = state.merchantList
  return { loading, list, total, url, currentUser: state.user.info, }
}

function mapDispatchToProps(dispatch) {
  return { dispatch }
}

export default connect(mapStateToProps)(MerchantList)