import React from 'react'
import { Button, Row, Col } from 'antd'
import { routerRedux, Link } from 'dva/router'
import Result from '../../../../components/Result'
import styles from './style.less'

export default ({ dispatch, data }) => {
  const onFinish = () => {
    dispatch({
      type: 'payment/step',
      payload: { formStep: 'step-form' },
    })
  }
  const information = (
    <div className={styles.information}>
      <Row>
        <Col span={8} className={styles.label}>付款账户：</Col>
        <Col span={16}>{`62270001708510405348`}</Col>
      </Row>
      <Row>
        <Col span={8} className={styles.label}>收款账户：</Col>
        <Col span={16}>{`87163578315641723492`}</Col>
      </Row>
      <Row>
        <Col span={8} className={styles.label}>收款人姓名：</Col>
        <Col span={16}>{`Ajax`}</Col>
      </Row>
      <Row>
        <Col span={8} className={styles.label}>转账金额：</Col>
        <Col span={16}><span className={styles.money}>{`20.00`}</span> 元</Col>
      </Row>
    </div>
  )
  const actions = (
    <div>
      <Button type="primary" onClick={onFinish}>
        继续提现
      </Button>
      <Button><Link to='/center/money/chargeList'>查看记录</Link></Button>
    </div>
  )
  return (
    <Result
      type="success"
      title="操作成功"
      // description="预计两小时内到账"
      extra={information}
      actions={actions}
      className={styles.result}
    />
  )
}
