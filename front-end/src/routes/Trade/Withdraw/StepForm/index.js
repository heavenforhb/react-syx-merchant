import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { Card, Steps, Form } from 'antd'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import styles from './style.less'

const { Step } = Steps

class StepForm extends PureComponent {
  getCurrentStep() {
    const { formStep } = this.props
    switch (formStep) {
      case 'step-form': return 0
      case 'confirm': return 1
      case 'result': return 2
      default: return 0
    }
  }
  getCurrentComponent() {
    const componentMap = {
      0: Step1,
      1: Step2,
      2: Step3,
    }
    return componentMap[this.getCurrentStep()]
  }
  render() {
    const { form, stepFormData, submitting, dispatch, initData } = this.props
    const formItemLayout = {
      labelCol: {
        span: 5,
        pull: 1
      },
      wrapperCol: {
        span: 17,
      },
    }
    const CurrentComponent = this.getCurrentComponent()
    return (
      <div>
        <Steps current={this.getCurrentStep()} className={styles.steps}>
          <Step title="填写提现信息" />
          <Step title="确认提现信息" />
          <Step title="完成" />
        </Steps>
        <CurrentComponent
          formItemLayout={formItemLayout}
          form={form}
          dispatch={dispatch}
          data={stepFormData}
          submitting={submitting}
          initData={initData}
        />
      </div>
    )
  }
}

const StepFormComponent = Form.create()(StepForm)

function mapStateToProps(state) {
  const { loading, formStep, stepFormData } = state.payment
  return {
    loading, formStep, stepFormData
  }
}

function mapDispatchToProps(dispatch) {
  return { dispatch }
}

export default connect(mapStateToProps)(StepFormComponent)
