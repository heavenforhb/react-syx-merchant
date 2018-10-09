import React from 'react'
import { Form, Input, Button, Select, Divider, Spin, Radio, Row, Col } from 'antd'
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
      <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
        <Spin spinning={false}>
          <Form.Item
            {...formItemLayout}
            label='账户可付款余额'
          >
            <span className={styles.money}>{`200,000.00`}</span> 元
          </Form.Item>
        </Spin>
        <Form.Item
          {...formItemLayout}
          label="转账金额"
        >
          {getFieldDecorator('amount', {
            initialValue: '500',
            rules: [
              { required: true, message: '请输入转账金额' },
              { pattern: /^(\d+)((?:\.\d+)?)$/, message: '请输入合法金额数字' },
            ],
          })(
            <Input prefix="￥" placeholder="请输入金额" />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label='本次扣除金额'
        >
          <Spin spinning={false}>
            <span className={styles.redMoney}>{`200.00`}</span> 元
            {true ? <span> (包含手续费 {`20.00`} 元)</span> : null}
          </Spin>
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label='付款账户'
        >
          {getFieldDecorator('ppFlg', {
            rules: [{ required: true, message: '请选择付款方式' }],
            initialValue: '01'
          })(
            <Radio.Group>
              <Radio value='01'>付款至个人银行账户</Radio>
              <Radio value='00'>付款至企业银行账户</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label='银行账户'
        >
          {getFieldDecorator('cardNo', {
            rules: [{ required: true, validator: null }],
            initialValue: '00'
          })(
            <Select
              mode='combobox'
              placeholder='您可以通过输入姓名搜索历史银行账号'
              showArrow={false}
              filterOption={false}
              onFocus={e => console.log(e)}
              onChange={e => console.log(e)}
              onSelect={e => console.log(e)}
            >
              <Select.OptGroup label='历史付款账号'>
                <Option value='00'>全部</Option>
              </Select.OptGroup>
            </Select>
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="付款账户"
        >
          {getFieldDecorator('payAccount', {
            initialValue: 'ant-design@alipay.com',
            rules: [{ required: true, message: '请选择付款账户' }],
          })(
            <Select placeholder="test@example.com">
              <Option value="ant-design@alipay.com">ant-design@alipay.com</Option>
            </Select>
          )}
        </Form.Item>
        <Spin spinning={false}>
          <Form.Item
            {...formItemLayout}
            label='收款银行'
          >
            {getFieldDecorator('bankCd', {
              rules: [{ required: true, message: '请选择收款银行' }],
              initialValue: '00'
            })(
              <Select placeholder='请选择收款银行' size='large' onChange={e => console.log(e)}>
                <Option value="00">ant-design@alipay.com</Option>
              </Select>
            )}
          </Form.Item>
        </Spin>
        <Form.Item
          {...formItemLayout}
          label="收款方户名"
        >
          {getFieldDecorator('receiverName', {
            initialValue: 'Alex',
            rules: [{ required: true, message: '请输入收款方户名' }],
          })(
            <Input placeholder="请输入收款方户名" />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label='开户行省市'
        >
          <Row>
            <Col span={11}>
              {getFieldDecorator('provCd', {
                rules: [{ required: true, message: '请选择开户行省份' }],
                initialValue: '00'
              })(
                <Select placeholder='请选择开户行省份' onChange={e => console.log(e)}>
                  <Option value='00'>请选择开户行省份</Option>
                </Select>
              )}
            </Col>
            <Col span={11} offset={2}>
              {getFieldDecorator('cityCd', {
                rules: [{ required: true, message: '请选择开户行城市' }],
                initialValue: '00'
              })(
                <Select placeholder='请选择开户行城市'>
                  <Option value='00'>请选择开户行城市</Option>
                </Select>
              )}
            </Col>
          </Row>
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label='支行名称'
        >
          {getFieldDecorator('lbankCd', {
            rules: [{ required: true, message: '请选择支行' }],
            initialValue: '00'
          })(
            <Select placeholder='请选择支行' onChange={e => console.log(e)}>
              <Option value="00">北京</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label='付款类型'
        >
          {getFieldDecorator('busType', {
            rules: [{ required: true, message: '请选择付款方式' }],
            initialValue: '3002'
          })(
            <Radio.Group>
              <Radio value='3002'>实时到账</Radio>
            </Radio.Group>
          )}
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
      {/* <Divider style={{ margin: '40px 0 24px' }} />
      <div className={styles.desc}>
        <h3>说明</h3>
        <h4>转账到支付宝账户</h4>
        <p>如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。</p>
        <h4>转账到银行卡</h4>
        <p>如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。</p>
      </div> */}
    </div>

  )
}
