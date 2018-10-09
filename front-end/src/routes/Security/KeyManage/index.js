import React, { Component } from 'react'
import { connect } from 'dva'
import {
  Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip,
} from 'antd'

import PageHeaderLayout from '../../../layouts/PageHeaderLayout'
import styles from './index.less'
import SendPhoneCode from '../../../components/SendPhoneCode'

const FormItem = Form.Item
const { Option } = Select
const { RangePicker } = DatePicker
const { TextArea } = Input

class KeyManageForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mercCd: props.currentUser.mercCd,
            SSL_text: false
        }
    }

    componentDidMount() {
      this._isMounted = true
      this.props.dispatch({ type: 'keyManage/fetch', payload: { mercCd: this.state.mercCd } })
    }

    componentWillMount() {
      this._isMounted = false
    }

    handleSubmit = (e) => {
      e.preventDefault()
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {          
          if(this.props.publicKey) {
            this.props.dispatch({ type: 'keyManage/update', payload: values })
          } else {
            this.props.dispatch({ type: 'keyManage/add', payload: values })
          }
        }
      })
    }

    SSL_TEXT_FUN = () => {
      return (
        <div style={{ padding: 15 }}>
            <div style={{ padding: 10, textAlign: 'right', fontSize: 26 }}><a onClick={() => this.setState({ SSL_text: false })}><Icon type="logout" /></a></div>
            <h1 style={{ borderBottom: '1px solid #EAECEF', padding: 3, fontWeight: 'bolder' }}>使用OpenSSL工具生成公钥</h1>
            <h2 style={{ borderBottom: '1px solid #EAECEF', padding: 3, fontWeight: 'bolder', marginTop: 25 }}>第一步 生成RSA公钥</h2>
            <div style={{ margin: '20px 0' }}>首先进入OpenSSL工具，输入以下命令。</div>
            <div style={{ backgroundColor: '#F6F8FA', padding: 20, whiteSpace: 'nowrap', overflowX: 'scroll' }}>
              <span><span>OpenSSL> genrsa -out app_private_key.pem</span><span style={{ paddingLeft: 20 }}>2048</span><span style={{ color: '#999988', paddingLeft: 20 }}>#生成私钥</span><br />
                <span>OpenSSL> pkcs8 -topk8 -inform PEM -<span style={{ fontWeight: 600 }}>in</span> app_private_key.pem -outform PEM -nocrypt -out app_private_key_pkcs8.pem</span><span style={{ color: '#999988', paddingLeft: 20 }}>#Java开发者需要将私钥转换成PKCS8格式</span><br />
                <span>OpenSSL> rsa -<span style={{ fontWeight: 600 }}>in</span> app_private_key.pem -pubout -out app_public_key.pem</span><span style={{ color: '#999988', paddingLeft: 20 }}>#生成公钥</span><br />
                <span>OpenSSL> <span style={{ fontWeight: 600 }}>exit</span></span><span style={{ color: '#999988', paddingLeft: 20 }}>#退出OpenSSL程序</span></span>
            </div>
            <div style={{ margin: '20px 0' }}>经过以上步骤，开发者可以在当前文件夹中（OpenSSL运行文件夹），看到app_private_key.pem（开发者RSA私钥，非Java语言适用）、app_private_key_pkcs8.pem（pkcs8格式开发者RSA私钥，Java语言适用）和app_public_key.pem（开发者RSA公钥）3个文件。开发者将私钥保留，将公钥提交给商银信配置到开发平台，用于验证签名。以下为私钥文件和公钥文件示例。</div>
            <div style={{ backgroundColor: '#F6F8FA', padding: 20 }}>
              <span>TIPS：对于使用Java的开发者，需将生成的pkcs8格式的私钥去除头尾、换行和空格，作为私钥填入代码中，对于.NET和PHP的开发者来说，无需进行pkcs8命令行操作。</span>
            </div>
            <div style={{ margin: '20px 0' }}>标准的私钥文件示例（PHP、.NET使用）</div>
            <div style={{ backgroundColor: '#F6F8FA', padding: 20, whiteSpace: 'nowrap', overflowX: 'scroll' }}>
              <span>-----BEGIN RSA PRIVATE KEY-----<br />
                MIICXQIBAAKBgQC+L0rfjLl3neHleNMOsYTW8r0QXZ5RVb2p/vvY3fJNNugvJ7lo4+fdBz+LN4mDxTz4MTOhi5e2yeAqx+v3nKpNmPzC5LmDjhHZURhwbqFtIpZD51mOfno2c3MDwlrsVi6mTypbNu4uaQzw/TOpwufSLWF7k6p2pLoVmmqJzQiD0QIDAQABAoGAakB1risquv9D4zX7hCv9MTFwGyKSfpJOYhkIjwKAik7wrNeeqFEbisqv35FpjGq3Q1oJpGkem4pxaLVEyZOHONefZ9MGVChT/MNH5b0FJYWl392RZy8KCdq376Vt4gKVlABvaV1DkapL+nLh7LMo/bENudARsxD55IGObMU19lkCQQDwHmzWPMHfc3kdY6AqiLrOss+MVIAhQqZOHhDe0aW2gZtwiWeYK1wB/fRxJ5esk1sScOWgzvCN/oGJLhU3kipHAkEAysNoSdG2oWADxlIt4W9kUiiiqNgimHGMHPwp4JMxupHMTm7D9XtGUIiDijZxunHv3kvktNfWj3Yji0661zHVJwJBAM8TDf077F4NsVc9AXVs8N0sq3xzqwQD/HPFzfq6hdR8tVY5yRMb4X7+SX4EDPORKKsgnYcur5lk8MUi7r072iUCQQC8xQvUne+fcdpRyrR4StJlQvucogwjTKMbYRBDygXkIlTJOIorgudFlrKP/HwJDoY4uQNl8gQJb/1LdrKwIe7FAkBl0TNtfodGrDXBHwBgtN/t3pyi+sz7OpJdUklKE7zMSBuLd1E3O4JMzvWP9wEE7JDb+brjgK4/cxxUHUTkk592<br />
                -----END RSA PRIVATE KEY-----</span>
            </div>
            <div style={{ margin: '20px 0' }}>PKCS8处理后的私钥文件示例（Java使用）</div>
            <div style={{ backgroundColor: '#F6F8FA', padding: 20, whiteSpace: 'nowrap', overflowX: 'scroll' }}>
              <span>MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBAN0yqPkLXlnhM+2H/57aHsYHaHXazr9pFQun907TMvmbR04wHChVsKVgGUF1hC0FN9hfeYT5v2SXg1WJSg2tSgk7F29SpsF0I36oSLCIszxdu7ClO7c22mxEVuCjmYpJdqb6XweAZzv4Is661jXP4PdrCTHRdVTU5zR9xUByiLSVAgMBAAECgYEAhznORRonHylm9oKaygEsqQGkYdBXbnsOS6busLi6xA+iovEUdbAVIrTCG9t854z2HAgaISoRUKyztJoOtJfI1wJaQU+XL+U3JIh4jmNx/k5UzJijfvfpT7Cv3ueMtqyAGBJrkLvXjiS7O5ylaCGuB0Qz711bWGkRrVoosPM3N6ECQQD8hVQUgnHEVHZYtvFqfcoq2g/onPbSqyjdrRu35a7PvgDAZx69Mr/XggGNTgT3jJn7+2XmiGkHM1fd1Ob/3uAdAkEA4D7aE3ZgXG/PQqlm3VbE/+4MvNl8xhjqOkByBOY2ZFfWKhlRziLEPSSAh16xEJ79WgY9iti+guLRAMravGrs2QJBAOmKWYeaWKNNxiIoF7/4VDgrcpkcSf3uRB44UjFSn8kLnWBUPo6WV+x1FQBdjqRviZ4NFGIP+KqrJnFHzNgJhVUCQFzCAukMDV4PLfeQJSmna8PFz2UKva8fvTutTryyEYu+PauaX5laDjyQbc4RIEMU0Q29CRX3BA8WDYg7YPGRdTkCQQCG+pjU2FB17ZLuKRlKEdtXNV6zQFTmFc1TKhlsDTtCkWs/xwkoCfZKstuV3Uc5J4BNJDkQOGm38pDRPcUDUh2/</span>
            </div>
            <div style={{ margin: '20px 0' }}>公钥文件示例</div>
            <div style={{ backgroundColor: '#F6F8FA', padding: 20, whiteSpace: 'nowrap', overflowX: 'scroll' }}>
              <span>-----<span style={{ fontWeight: 600 }}>BEGIN</span> PUBLIC KEY-----<br />
                MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDQWiDVZ7XYxa4CQsZoB3n7bfxLDkeGKjyQPt2FUtm4TWX9OYrd523iw6UUqnQ+Evfw88JgRnhyXadp+vnPKP7unormYQAfsM/CxzrfMoVdtwSiGtIJB4pfyRXjA+KL8nIa2hdQy5nLfgPVGZN4WidfUY/QpkddCVXnZ4bAUaQjXQIDAQAB<br />
                -----<span style={{ fontWeight: 600 }}>END</span> PUBLIC KEY-----</span>
            </div>
            <h2 style={{ borderBottom: '1px solid #EAECEF', padding: 3, fontWeight: 'bolder', marginTop: 25 }}>第二步 处理应用公钥格式</h2>
            <div style={{ margin: '20px 0' }}>将公钥文件去除头尾、换行和空格，转成一行字符串。把该字符串提供给商银信商户平台账号管理者，登录平台获取商银信商户平台公钥。</div>
            <div style={{ margin: '20px 0' }}>例如转换前公钥pem文件格式：</div>
            <div style={{ backgroundColor: '#F6F8FA', padding: 20, whiteSpace: 'nowrap', overflowX: 'scroll' }}>
              <span>-----<span style={{ fontWeight: 600 }}>BEGIN</span> PUBLIC KEY-----<br />
                MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDQWiDVZ7XYxa4CQsZoB3n7bfxLDkeGKjyQPt2FUtm4TWX9OYrd523iw6UUqnQ+Evfw88JgRnhyXadp+vnPKP7unormYQAfsM/CxzrfMoVdtwSiGtIJB4pfyRXjA+KL8nIa2hdQy5nLfgPVGZN4WidfUY/QpkddCVXnZ4bAUaQjXQIDAQAB<br />
                -----<span style={{ fontWeight: 600 }}>END</span> PUBLIC KEY-----</span>
            </div>
            <div style={{ margin: '20px 0' }}>转换后得到的字符串为：</div>
            <div style={{ backgroundColor: '#F6F8FA', padding: 20, whiteSpace: 'nowrap', overflowX: 'scroll' }}>
              <span>MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDQWiDVZ7XYxa4CQsZoB3n7bfxLDkeGKjyQPt2FUtm4TWX9OYrd523iw6UUqnQ+Evfw88JgRnhyXadp+vnPKP7unormYQAfsM/CxzrfMoVdtwSiGtIJB4pfyRXjA+KL8nIa2hdQy5nLfgPVGZN4WidfUY/QpkddCVXnZ4bAUaQjXQIDAQAB</span>
            </div>
            <h2 style={{ borderBottom: '1px solid #EAECEF', padding: 3, fontWeight: 'bolder', marginTop: 25 }}>第三步 处理商银信公钥格式(针对文本读取方式)</h2>
            <div style={{ margin: '20px 0' }}>上一步获取到商银信商户平台公钥，用于商银信返回数据的验签。 对于商银信公钥，看到的是一个字符串，如下：</div>
            <div style={{ backgroundColor: '#F6F8FA', padding: 20, whiteSpace: 'nowrap', overflowX: 'scroll' }}>
              <span>MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDDI6d306Q8fIfCOaTXyiUeJHkrIvYISRcc73s3vF1ZT7XN8RNPwJxo8pWaJMmvyTn9N4HQ632qJBVHf8sxHi</span>
            </div>
            <div style={{ margin: '20px 0' }}>转换后得到的字符串为：</div>
            <div style={{ backgroundColor: '#F6F8FA', padding: 20, whiteSpace: 'nowrap', overflowX: 'scroll' }}>
              <span>-----<span style={{ fontWeight: 600 }}>BEGIN</span> PUBLIC KEY-----<br />
                MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDDI6d306Q8fIfCOaTXyiUeJHkrIvYISRcc73s3vF1ZT7XN8RNPwJxo8pWaJMmvyTn9N4HQ632qJBVHf8sxHi/fEsraprwCtzvzQETrNRwVxLO5jVmRGi60j8Ue1efIlzPXV9je9mkjzOmdssymZkh2QhUrCmZYI/FCEa3/cNMW0QIDAQAB<br />
                -----<span style={{ fontWeight: 600 }}>END</span> PUBLIC KEY-----</span>
            </div>
          </div>
      )
    }
      render() {
        const { currentUser, mercName, loading, phoneNo, publicKey, signType } = this.props
        const { getFieldDecorator, getFieldValue } = this.props.form
    
        const formItemLayout = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 7 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 12 },
            md: { span: 10 },
          },
        }
    
        const submitFormLayout = {
          wrapperCol: {
            xs: { span: 24, offset: 0 },
            sm: { span: 10, offset: 7 },
          },
        }
    
        return (
          <PageHeaderLayout title="商户公钥维护">
            <Card bordered={false}>
              {
                this.state.SSL_text ? this.SSL_TEXT_FUN() : <Form
                  onSubmit={this.handleSubmit}
                  hideRequiredMark
                  style={{ marginTop: 8 }}
                >
                  <FormItem
                    {...formItemLayout}
                    label="商户编号"
                  >
                    {getFieldDecorator('mercCd', {
                      rules: [{
                        required: true, message: '请输入商户编号',
                      }],
                      initialValue: currentUser.mercCd
                    })(
                      <Input placeholder="请输入商户编号" disabled />
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="商户名称"
                  >
                    {getFieldDecorator('mercName', {
                      rules: [{
                        required: true, message: '请输入商户名称',
                      }],
                      initialValue: mercName
                    })(
                      <Input placeholder="请输入商户名称" disabled />
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="签名方式"
                  >
                    {getFieldDecorator('signType', {
                      rules: [{
                        required: true, message: '请选择签名方式',
                      }],
                      initialValue: signType
                    })(
                      <Select>
                          <Option value='RSA2'>RSA2</Option>
                      </Select>
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="商户公钥"
                  >
                      <div>
                          {getFieldDecorator('publicKey', {
                              rules: [{
                                  required: true, message: '请输入商户公钥',
                              }],
                              initialValue: publicKey
                              })(
                              <TextArea style={{ minHeight: 32 }} placeholder="请输入商户公钥" rows={6} />
                          )}
                          <span><a onClick={() => this.setState({ SSL_text: true })}>使用OpenSSL工具生成公钥</a>
                        <a style={{ marginLeft: 30 }} href={'http://rsa-tool.allscore.cn/'} target='_blank'>去生成商户公钥</a></span>
                      </div>
                    
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label='管理员手机号'
                  >
                    <SendPhoneCode smsType='07' phoneNo={phoneNo} _isMounted={this._isMounted} />
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="验证码"
                  >
                      {getFieldDecorator('smsCode', {
                          rules: [{
                          required: true, message: '请输入手机验证码',
                        }],
                      })(
                        <Input placeholder='请输入手机验证码' style={{ width: 220 }} />
                      )}
                  </FormItem>
                  <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                    {
                      publicKey ? <Button type="primary" htmlType="submit" loading={loading}>
                      确认修改
                    </Button> : <Button type="primary" htmlType="submit" loading={loading}>
                      确认添加
                    </Button>
                    }
                  </FormItem>
                </Form>
              }
            </Card>
          </PageHeaderLayout>
        )
      }
    }

function mapStateToProps(state) {
    const { mercName, mercCd, phoneNo } = state.user.merchantInfo
    const { publicKey, signType, loading } = state.keyManage
    return {
        mercName, currentUser: state.user.info, publicKey, signType, loading, phoneNo
    }
}

function mapDispatchToProps(dispatch) {
    return { dispatch }
}

const KeyManage = Form.create()(KeyManageForm)

export default connect(mapStateToProps)(KeyManage)


