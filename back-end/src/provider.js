
const { env } = process
const { ZIMG_HOST } = env
export default {
  fileServer: `http://${ZIMG_HOST || '123.56.90.180:8000'}`, //图片上传地址
  mercLogin: 'PROVIDER-MERC:/merc/login', //登录
  imgCode: 'PROVIDER-MESSAGE-SERVER:/message/server/picture/make/vcode', // 图片验证满
  smsSend: 'PROVIDER-MERC:/merc/message/sms/send', // 手机验证码
  passGuardInit: 'PROVIDER-MERC:/microdone/passguard/get/init', // 初始化密码控件
  passGuardAes: 'PROVIDER-MERC://microdone/h5/get/randKey', // 获取randkey
  mercOprInfo: 'PROVIDER-MERC:/merc/oprInfo', // 获取操作员信息
  mercInfo: 'PROVIDER-MERC:/merc/getMercInfo', //获取商户基本信息
  orderList: 'PROVIDER-ORDER:/order/tran/page', // 交易信息列表
  noticePage:"PROVIDER-MNG:/mng/notice/page", // 公告列表查询
  tranDetail:"PROVIDER-ORDER:/order/tran/detail", //交易订单详情
  accountPage:"PROVIDER-ACM:/acm/acdata/page", //分页查询金融历史流水
  accountAmt:"PROVIDER-ACM:/acm/acbal/mercAcBal", //查询账户资金
  sales:"PROVIDER-ORDER:/order/merc/list", //图表数据查询
  workSheetPage: "PROVIDER-MNG:/mng/worksheet/page", //工单列表查询
  workSheetAdd: "PROVIDER-MNG:/mng/worksheet/add", //工单列表查询
  oprInfoNormalUpdate: "PROVIDER-MERC:/merc/oprInfonormal/update", //更新操作员信息
  setReseInfo: "PROVIDER-MERC:/merc/mercInfo/setReseInfo", // 设置预留信息
  keyPlat: "PROVIDER-POSP:/keyinfo/findAllOrderKeyInfo", //平台公钥信息
  settleQueryPage:"PROVIDER-PSS:/pss/settle/page",//分页查询结算单
  queryRefundInfo:"PROVIDER-ORDER:/order/refund/page", //退款流水分页查询
  refundDetail:"PROVIDER-ORDER:/order/refund/detail",//退款详情查询
  paymentListPage:"PROVIDER-POSP:/posp/payment/page", //付款信息分页查询
  paymentListDetail:"PROVIDER-POSP:/posp/payment/detail",//付款详情
  freezePage:'PROVIDER-ACM:/acm/frzdata/page',//分页查询金融冻结流水
  chargeListPage:"PROVIDER-POSP:/posp/recharge/page",//分页查询充值记录
  chargeListDetail:"PROVIDER-POSP:/posp/recharge/detail",//充值记录详情
  withdrawListPage:"PROVIDER-POSP:/posp/withdraw/page",//分页查询提现记录
  withdrawListDetail:"PROVIDER-POSP:/posp/withdraw/detail",//提现记录详情
  merchantPage:"PROVIDER-MERC:/merc/mercInfo/page",//代理商下商户列表查询
  profitPage:"PROVIDER-ORDER:/order/profit/page",//分润分页查询
  peofitDetail:"PROVIDER-ORDER:/order/profit/detail",//分润记录详情
  keyManageInput:"PROVIDER-MERC:/merc/key/inputInfo",//商户密钥信息录入
  keyManageInfo:"PROVIDER-MERC:/merc/key/queryMercKeyInfo",//密钥信息查询
  keyManageUpdate:"PROVIDER-MERC:/merc/key/updatePubRsaOrMd5",//密钥信息更新

  mercFeeInfoPage: 'PROVIDER-MERC:/merc/feeInfo/page', // 商户费率分页查询
  mercBusiInfo:"PROVIDER-MERC:/merc/getMercBusiInfo", // 商户经营信息查询
  mercStateInfo:"PROVIDER-MERC:/merc/getMercStateInfo", // 商户结算信息查询
  mercSuperUpdate:"PROVIDER-MERC:/merc/oprInfosuper/update", //更新商户基本信息
  mercStateInfoUpdate:"PROVIDER-MERC:/merc/state/infoAudit/updSettleAcctInfo", // 更新商户结算信息
  bankList:"PROVIDER-CMM:/cmm/lbank/list", //银行列表查询
  cityList: 'PROVIDER-CMM:/cmm/city/list', // 地区列表查询
  lbankList:"PROVIDER-CMM:/cmm/bankLink/list", //支行列表查询
  notifyReissue:"PROVIDER-ORDER:/order/notify/reissue",//交易订单补发通知
  refundApply:"PROVIDER-ORDER:/order/refund/",//商户退款请求

  profitDataList:"PROVIDER-ORDER:/order/profitOrder/list", //分页查询代理商分润结算信息
  appDetail:"PROVIDER-ORDER:/profit/order/details", //结算详情
  againApply:"PROVIDER-ORDER:/profit/order/reApply", //重新提交结算申请
  applyPage:"PROVIDER-ORDER:/profit/order/page", //申请记录分页查询

  initProfitData:"PROVIDER-ORDER:/order/profitOrder/initProfitData", //初始化待选分润信息
  bindApply:"PROVIDER-ORDER:/profit/order/bindApply", //日分润绑定申请或取消绑定
  cancelApply:"PROVIDER-ORDER:/profit/order/cancelApply", //取消分润申请
  lockDate:"PROVIDER-ORDER:/profit/order/lockDate", //锁定分润申请日期
  openApply:"PROVIDER-ORDER:/profit/order/openApply", //打开申请信息
  saveApply:"PROVIDER-ORDER:/profit/order/saveApply", //保存分润申请 

  //菜单信息
  menuInfo: "PROVIDER-MERC:/merc/menu/queryAll",//查询所有菜单项

  // 角色管理
  rolePage: "PROVIDER-MERC:/merc/roleInfo/page",//角色列表查询
  roleSave: "PROVIDER-MERC:/merc/roleInfo/save",//角色添加
  roleUpdate: "PROVIDER-MERC:/merc/roleInfo/update",//角色编辑
  roleDelete: "PROVIDER-MERC:/merc/roleInfo/delete",//角色删除

  //操作员管理
  oprInfoPage: "PROVIDER-MERC:/merc/listStsMerOpr",//分页查询操作员信息记录
  oprAdd: "PROVIDER-MERC:/merc/save",//操作员基本信息添加
  modifyOprStatus: "PROVIDER-MERC:/merc/updateMerOprStatus/basic",//更新操作员状态
  modifyOprInfo: "PROVIDER-MERC:/merc/updateMerOpr/basic",//更新操作员基本信息
  oprStsPage: "PROVIDER-MERC:/merc/operHislistSts",//分页查询操作员状态修改记录
  queryOprisExist: "PROVIDER-MERC:/merc/isExit",//查询商户下操作员编号是不是存在

  // 密码管理
  modifyLoginPwd:"PROVIDER-MERC:/merc/security/modifyLoginPwd", //修改登陆密码
  modifyPayPwd:"PROVIDER-MERC:/merc/security/modifyPayPwd", //修改支付密码
  setPayPwd:"PROVIDER-MERC:/merc/security/setPayPwd", //设置支付密码
  checkAccInfo:"PROVIDER-MERC:/merc/security/checkAccInfo", //找回登陆密码--验证企业信息
  checkOprInfo:"PROVIDER-MERC:/merc/security/checkOprInfo", //找回登陆密码--验证登陆账号信息
  sendForgetEmail: 'PROVIDER-MERC:/merc/message/email/send', //找回密码发送邮件
  resetLoginPwd:"PROVIDER-MERC:/merc/security/resetLoginPwd", //商户找回密码-重置登录密码
  resetPayPwd:"PROVIDER-MERC:/merc/security/resetPayPwd", //商户找回密码-重置支付密码

  //ca证书管理
  caDetail:"PROVIDER-MERC:/merc/ca/detail",//CA证书详情
  caInit:"PROVIDER-MERC:/merc/ca/init",//CA初始化
  caInstall:"PROVIDER-MERC:/merc/ca/install",//CA证书安装
  caPage:"PROVIDER-MERC:/merc/ca/page",//分页查询CA证书
  caRevokeOne:"PROVIDER-MERC:/merc/ca/revokeOne",//吊销单个CA证书
  
  //下载接口
  orderTranDataExcel:"PROVIDER-ORDER:/order/excel/madeFile/orderTranData",//收款订单 导出Excel
  statementDataExcel:"PROVIDER-PSS:/pss/settle/madeFile/detailInfo", //结算信息 导出Excel
  refundDataExcel:"PROVIDER-ORDER:/order/excel/madeFile/orderRefundData",//退款订单 导出Excel
  paymentListDataExcel:"PROVIDER-POSP:/order/excel/madeFile/orderPaymentData",//付款订单 导出Excel
  freezeDataExcel:"PROVIDER-ACM:/acm/excel/madeFile/acmFrzBalData",//冻结订单 导出Excel
  chargeListDataExcel:"PROVIDER-POSP:/order/excel/madeFile/orderRechargeData",//充值订单 导出Excel
  withdrawListDataExcel:"PROVIDER-POSP:/order/excel/madeFile/orderWithdrawData",//提现订单 导出Excel
  merchantListDataExcel:"PROVIDER-MERC:/merc/excel/madeFile/mercInfoData", //商户列表 导出Excel
  profitDataExcel:"PROVIDER-ORDER:/order/excel/madeFile/orderProfitInfo", //分润列表 导出Excel

  excelQueryStatus_order:"PROVIDER-ORDER:/order/excel/madeFile/queryStatus",//查询excel地址ORDER服务
  excelQueryStatus_posp:"PROVIDER-POSP:/order/excel/madeFile/queryStatus",//查询excel地址POSP服务
  excelQueryStatus_merc:"PROVIDER-MERC:/merc/excel/madeFile/queryStatus",//查询excel地址MERC服务
  excelQueryStatus_acm:"PROVIDER-ACM:/acm/excel/madeFile/queryStatus",//查询excel地址ACM服务
  excelQueryStatus_pss:"PROVIDER-PSS:/pss/settle/madeFile/queryStatus",//查询excel地址pss服务
}