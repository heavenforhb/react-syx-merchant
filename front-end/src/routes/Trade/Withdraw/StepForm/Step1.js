import React from 'react'
import { Form, Input, Button, Select, Divider, Spin, Radio, Row, Col, Table } from 'antd'
import { routerRedux } from 'dva/router'
import styles from './style.less'

const { Option } = Select

export default ({ formItemLayout, form, dispatch }) => {
  const { getFieldDecorator, validateFields } = form
  const onValidateForm = () => {
    validateFields((err, values) => {
      if (!err) {
        console.log(values)
        dispatch({
          type: 'payment/step',
          payload: { formStep: 'confirm' },
        })
      }
    })
  }
  return (
    <div>
      <div style={{ padding: 20 }}>
        <Table columns={[
          { title: '账户类型', dataIndex: 'ppFlg', key: 'ppFlg' },
          { title: '收款方户名', dataIndex: 'acctName', key: 'acctName' },
          { title: '银行账户', dataIndex: 'cardNo', key: 'cardNo' },
          { title: '开户银行', dataIndex: 'bankName', key: 'bankName' },
          { title: '支行名称', dataIndex: 'lbankName', key: 'lbankName' }
        ]} dataSource={[]} rowSelection={{
          type: 'radio',
          selectedRowKeys: [0]
        }} />
      </div>
      <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
        <Spin spinning={false}>
          <Form.Item
            {...formItemLayout}
            label='账户可提现余额'
          >
            <span className={styles.money}>{`200,000.00`}</span> 元
          </Form.Item>
        </Spin>
        <Form.Item
          {...formItemLayout}
          label='业务类型'
        >
          {getFieldDecorator('ppFlg', {
            rules: [{ required: true, message: '请选择付款方式' }],
            initialValue: '01'
          })(
            <Radio.Group>
              <Radio value='01'>实时到账</Radio>
              <Radio value='00'>普通到账</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="提现金额"
        >
          <Row gutter={16}>
            <Col span={16}>
              {getFieldDecorator('amount', {
                initialValue: '500',
                rules: [
                  { required: true, message: '请输入转账金额' },
                  { pattern: /^(\d+)((?:\.\d+)?)$/, message: '请输入合法金额数字' },
                ],
              })(
                <Input prefix="￥" placeholder="请输入金额" />
              )}
            </Col>
            <Col span={8}>
              手续费：<span>20.00</span>元
            </Col>
          </Row>
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label='付款原因'
        >
          {getFieldDecorator('addition')(
            <Input.TextArea placeholder='请填写付款原因' type='textarea' rows={3} />
          )}
        </Form.Item>
        <Form.Item
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: formItemLayout.wrapperCol.span, offset: formItemLayout.labelCol.span },
          }}
          label=""
        >
          <Button type="primary" onClick={onValidateForm}>
            下一步
          </Button>
        </Form.Item>
      </Form>
      <Divider style={{ margin: '40px 0 24px' }} />
      <div className={styles.desc}>
        <h3>说明</h3>
        <h4>转账到支付宝账户</h4>
        <p>如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。</p>
        <h4>转账到银行卡</h4>
        <p>如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。</p>
      </div>
    </div>

  )
}
