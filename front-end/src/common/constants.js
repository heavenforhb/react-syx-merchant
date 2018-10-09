// 交易状态
export const ORDER_STATUS = {
  "SUCCESS": {
    "name": "支付成功",
    "color": "#1294f6",
    "icon": "check-circle-o"
  },
  "REFUND": {
    "name": "已退款",
    "color": "#f00",
    "icon": "close-circle-o"
  },
  "WAITPAY": {
    "name": "待支付",
    "color": "#1294f6",
    "icon": "clock-circle-o"
  },
  "PENDING": {
    "name": "用户支付中",
    "color": "#1294f6",
    "icon": "clock-circle-o"
  },
  "CLOSED": {
    "name": "订单关闭",
    "color": "#999"
  },
  "PAYERROR": {
    "name": "支付失败",
    "color": "#f00",
    "icon": "exclamation-circle-o"
  },
  "FAIL": {
    "name": "交易失败",
    "color": "#f00",
    "icon": "close-circle-o"
  }
}

// 结算单状态
export const STATEMENT_STATUS = {
  "SUCCESS": {
    "name": "付款成功",
    "color": "#1294f6",
    "icon": "check-circle-o"
  },
  "INHAND": {
    "name": "系统处理中",
    "color": "#f00",
    "icon": "clock-circle-o"
  },
  "NOTPAY": {
    "name": "待付款",
    "color": "#1294f6",
    "icon": "clock-circle-o"
  },
  "PENDING": {
    "name": "银行付款中",
    "color": "#1294f6",
    "icon": "clock-circle-o"
  },
  "PAYERROR": {
    "name": "付款失败",
    "color": "#f00",
    "icon": "exclamation-circle-o"
  }
}

//退款状态
export const REFUND_STATUS = {
  "SUCCESS": {
    "name": "退款成功",
    "color": "#1294f6",
    "icon": "check-circle-o"
  },
  "INHAND": {
    "name": "系统处理中",
    "color": "#f00",
    "icon": "clock-circle-o"
  },
  "NOTPAY": {
    "name": "待处理",
    "color": "#1294f6",
    "icon": "clock-circle-o"
  },
  "PENDING": {
    "name": "银行退款中",
    "color": "#1294f6",
    "icon": "clock-circle-o"
  },
  "PAYERROR": {
    "name": "退款失败",
    "color": "#f00",
    "icon": "exclamation-circle-o"
  }
}

//付款状态
export const PAYMENT_STATUS = {
  "SUCCESS": {
    "name": "付款成功",
    "color": "#1294f6",
    "icon": "check-circle-o"
  },
  "INHAND": {
    "name": "系统处理中",
    "color": "#f00",
    "icon": "clock-circle-o"
  },
  "NOTPAY": {
    "name": "待付款",
    "color": "#1294f6",
    "icon": "clock-circle-o"
  },
  "PENDING": {
    "name": "银行付款中",
    "color": "#1294f6",
    "icon": "clock-circle-o"
  },
  "PAYERROR": {
    "name": "付款失败",
    "color": "#f00",
    "icon": "exclamation-circle-o"
  },
  "REFUND": {
    "name": "已退款",
    "color": "#f00",
    "icon": "close-circle-o"
  }
}

//充值状态
export const CHARGE_STATUS = {
  "SUCCESS": {
    "name": "充值成功",
    "color": "#1294f6",
    "icon": "check-circle-o"
  },
  "PENDING": {
    "name": "充值中",
    "color": "#1294f6",
    "icon": "clock-circle-o"
  },
  "PAYERROR": {
    "name": "充值失败",
    "color": "#f00",
    "icon": "exclamation-circle-o"
  },
  "CLOSED": {
    "name": "订单关闭",
    "color": "#999"
  },
}

//提现状态
export const WITHDRAW_STATUS = {
  "SUCCESS": {
    "name": "提现成功",
    "color": "#1294f6",
    "icon": "check-circle-o"
  },
  "INHAND": {
    "name": "系统处理中",
    "color": "#f00",
    "icon": "clock-circle-o"
  },
  "NOTPAY": {
    "name": "待付款",
    "color": "#1294f6",
    "icon": "clock-circle-o"
  },
  "PENDING": {
    "name": "银行处理中",
    "color": "#1294f6",
    "icon": "clock-circle-o"
  },
  "PAYERROR": {
    "name": "提现失败",
    "color": "#f00",
    "icon": "exclamation-circle-o"
  },
  "REFUND": {
    "name": "已退款",
    "color": "#f00",
    "icon": "close-circle-o"
  }
}

// 结算状态
export const PROFIT_STATUS = {
  "S2": {
    "name": "已结算",
    "color": "#1294f6",
    "icon": "check-circle-o"
  },
  "A1": {
    "name": "已申请",
    "color": "#f00",
    "icon": "clock-circle-o"
  },
  "S1": {
    "name": "未结算",
    "color": "#1294f6",
    "icon": "clock-circle-o"
  },
  "R1": {
    "name": "审核拒绝",
    "color": "#f00",
    "icon": "exclamation-circle-o"
  }
}

//结算申请状态
export const APPLY_AGENT_STS = {
  "UNSTART": "资料未完善",
  "UNAUDITED":"未审核",
	"FIRSTTRIAL":"初审通过",
	"SETTLED":"已结算",
  "REFUSE":"审核拒绝",
  "TERMINATE": "已失效"
}

// 交易类型
export const TRAN_TYPE = {
  "1001": "普通收款",
  "1002": "实时收款",
  "1003": "代付",
  "1004": "充值",
  "1005": "提现",
  "1006": "结算",
  "1007": "退款",
  "1101": "身份验证",
  "1102": "银行卡签约",
  "1201": "转账"
}

// 业务类型
export const BUS_TYPE = {
  "1001": {
    "2001": "个人网银",
    "2002": "快捷支付",
    "2003": "微信扫码",
    "2004": "支付宝扫码",
    "2005": "认证支付",
    "2006": "企业网银",
    "2007": "无卡支付"
  },
  "1002": {
    "2001": "个人网银",
    "2002": "快捷支付",
    "2003": "微信扫码",
    "2004": "支付宝扫码",
    "2005": "认证支付",
    "2006": "企业网银",
    "2007": "无卡支付"
  },
  "1003": {
    "3001": "普通到账",
    "3002": "实时到账"
  },
  "1004": {
    "2001": "个人网银",
    "2006": "企业网银"
  },
  "1005": {
    "3001": "普通到账",
    "3002": "实时到账"
  },
  "1006": {
    "4001": "系统结算",
    "4002": "指令结算"
  },
  "1007": {
    "5001": "基本账户退款"
  },
  "1101": {
    "2101": "银行卡四要素验证",
    "2102": "银行卡两要素验证",
    "2103": "身份证实名验证"
  },
  "1102": {
    "2201": "快捷支付签约"
  },
  "1201": {
    "6001": "资金转入",
    "6002": "资金转出"
  }
}
//账户类型
export const CAP_TYPE = {
  "000": "基本账户",
  "001": "结算账户"
}
//收支标识
export const DC_FLG = {
  "IN": "收入",
  "OUT": "支出"
}

//商户状态
export const MERCHANT_STATUS = {
  "Y": "正常",
  "N": "暂停",
  "D": "冻结",
  "C": "注销"
}

//工单状态
export const WORK_SHEET_STATUS = {
  "S1": {
    "name": "待解决",
    "color": "#1294f6",
    "icon": "clock-circle-o"
  },
  "S2": {
    "name": "已解决",
    "color": "#1294f6",
    "icon": "check-circle-o"
  }
}

//工单类型
export const WORK_SHEET_TYPE = {
  "B": "业务问题",
  "T": "技术问题",
  "O": "订单问题"
}

//申请数字证书
export const CERT_LOCATION = {
  "01": "公司",
  "02": "家",
  "03": "公共场所",
  "04": "自定义",
}

//商户类型
export const AGENT_MERCHANT_TYPE = {
  "N1": "普通商户",
  "S1": "代理商商户申请中",
  "A1": "代理商商户",
}

//操作员状态
export const OPR_STATUS = {
  "Y": "正常",
  "N": "暂停",
  "C": "注销"
}

// 冻结状态
export const FREEZE_STATUS = {
  "00": "冻结",
  "01": "全部解冻",
  "02": "部分解冻"
}

//冻结类型
export const FREEZE_TYPE = {
  "1005": "提现",
  "1006": "结算",
  "1007": "退款",
  "1003": "付款"
}

export const STLAC_TYPE = {
  "B1": "结算到基本账户",
  "C1": "结算到银行账户"
}

export const FEE_TYPE = {
  "F": "固定",
  "P": "百分比"
}

export const CAP_FLG = {
  "Y": "封顶",
  "N": "不封顶"
}

export const PP_FLG = {
  "00": "对公账户",
  "01": "对私账户"
}

