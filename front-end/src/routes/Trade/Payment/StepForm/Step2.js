import React, { Component } from 'react'
import { Form, Input, Button, Alert, Divider } from 'antd'
import { routerRedux } from 'dva/router'
import styles from './style.less'
import SendPhoneCode from '../../../../components/SendPhoneCode'
import InputComponent from '../../../../components/Input'
import PassGuardComponent from '../../../../components/PassGuard'
import request from '../../../../utils/request'
import moment from 'moment'

export default class StepFormTwo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initData: null,
      tranTime: null
    }
  }

  componentDidMount() {
    request('/api/common/passGuardInit').then(data => {
      this.setState({ initData: data })
    }).catch(e => {
      console.error(e)
      notification.error({ message: '密码控件初始化失败' })
    })
    let tranTime =  moment().format('YYYY-MM-DD HH:mm:ss')
    this.setState({ tranTime })
  }

  onPrev = () => {
    this.props.dispatch({
      type: 'payment/step',
      payload: { formStep: 'step-form' },
    })
  }
  onValidateForm = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'payment/step',
          payload: { formStep: 'result' },
        })
      }
    })
  }

  render() {
    const { formItemLayout, form, data, dispatch, submitting } = this.props
    return (
      <Form layout="horizontal" className={styles.stepForm}>
        <Alert message='数字证书保护中' type='success' closable showIcon style={{ marginBottom: 24 }} />
        <Form.Item
          {...formItemLayout}
          className={styles.stepFormText}
          label="收款方户名"
        >
          {`开户银行`}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          className={styles.stepFormText}
          label="银行账号"
        >
          {`开户银行`}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          className={styles.stepFormText}
          label="开户银行"
        >
          {`开户银行`}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          className={styles.stepFormText}
          label="支行名称"
        >
          <span>{`光华路建设支行`}</span>
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          className={styles.stepFormText}
          label="付款金额"
        >
          <span className={styles.money}>{`20.00`}</span>
          <span className={styles.uppercase}>（{`贰拾元整`}）</span>
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          className={styles.stepFormText}
          label="手续费"
        >
          <span className={styles.money}>{`20.00`}</span>
          <span className={styles.uppercase}>（{`贰拾元整`}）</span>
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          className={styles.stepFormText}
          label="本账户扣款金额"
        >
          <span className={styles.money}>{`40.00`}</span>
          <span className={styles.uppercase}>（{`肆拾元整`}）</span>
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          className={styles.stepFormText}
          label="交易时间"
        >
          <span>{this.state.tranTime}</span>
        </Form.Item>
        <Divider style={{ margin: '24px 0' }} />
        <Form.Item
          {...formItemLayout}
          className={styles.stepFormText}
          label="手机号"
        >
          <SendPhoneCode phoneNo='13681204465' smsType='03' />
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          className={styles.stepFormText}
          label="短信验证码"
        >
          <Input placeholder='请输入短信验证码' />
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="支付密码"
          required={false}
        >
          <InputComponent placeholder='请输入支付密码' maxLength={6}>
            <PassGuardComponent pgeEreg2='[0-9]{6}' initData={this.state.initData} />
          </InputComponent>
        </Form.Item>
        <Form.Item
          style={{ marginBottom: 8 }}
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: formItemLayout.wrapperCol.span, offset: formItemLayout.labelCol.span },
          }}
          label=""
        >
          <Button type="primary" onClick={this.onValidateForm} loading={submitting}>
            提交
          </Button>
          <Button onClick={this.onPrev} style={{ marginLeft: 8 }}>
            上一步
          </Button>
        </Form.Item>
      </Form>
    )
  }

} 
