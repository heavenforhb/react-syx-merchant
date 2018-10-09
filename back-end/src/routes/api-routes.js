const router = require('koa-router')()

import Controllers from '../controllers/'
import { menuAll } from '../controllers/Common';

router.prefix('/api')

router.post('/user/login', Controllers.User.login)  // 登录
router.get('/user/oprInfo', Controllers.User.oprInfo) // 操作员信息查询
router.get('/user/mercInfo', Controllers.User.mercInfo) //账户信息查询
router.put('/user/oprInfonormal/update', Controllers.User.oprInfoNormalUpdate) // 跟新操作员信息
router.post('/user/mercInfo/setReseInfo', Controllers.User.setReseInfo) // 设置预留信息
router.get('/common/imgCode', Controllers.Common.imgCode) // 获取图片验证码
router.post('/user/sms/send', Controllers.User.smsSend) // 手机验证码发送
router.get('/common/passGuardInit', Controllers.Common.passGuardInit) // 密码控件初始化
router.get('/common/passGuardAes', Controllers.Common.passGuardAes) // 密码控件randkey
router.get('/order/page', Controllers.Order.list) // 分页查询订单信息
router.get('/order/detail', Controllers.Order.tranDetail) // 订单详细信息
router.get('/notice/page', Controllers.Notice.page) // 分页查询公告信息
router.get('/home/accountPage', Controllers.Home.accountPage) // 账户收支分页查询
router.get('/home/accountAmt', Controllers.Home.accountAmt) // 账户金额查询
router.get('/home/sales', Controllers.Home.sales) // 图表信息插询
router.get('/workSheet/page', Controllers.WorkSheet.list) // 分页查询工单信息
router.post('/worksheet/add', Controllers.WorkSheet.workSheetAdd)//分页查询公告通知信息
router.post('/common/file', Controllers.Common.upload) // 图片上传
router.get('/common/file/:fid', Controllers.Common.get)  // 展示图片
router.get('/keyPlatform/fetch', Controllers.KeyPlatform.fetch) // 平台公钥
router.get('/statement/page', Controllers.Statement.page) // 结算单分页查询
router.get('/refund/page', Controllers.Refund.page) // 退款信息分页查询
router.get('/refund/detail', Controllers.Refund.detail) // 退款信息详情查询
router.get('/paymentList/page', Controllers.PaymentList.page) // 付款信息分页查询
router.get('/paymentList/detail', Controllers.PaymentList.detail) // 付款信息详情查询
router.get('/freeze/page', Controllers.Freeze.page) // 冻结信息分页查询
router.get('/chargeList/page', Controllers.ChargeList.page) //充值记录分页查询
router.get('/chargeList/detail', Controllers.ChargeList.detail) //充值详情
router.get('/withdrawList/page', Controllers.WithdrawList.page) //提现记录分页查询
router.get('/withdrawList/detail', Controllers.WithdrawList.detail) //提现详情
router.get('/Profit/page', Controllers.Profit.page) //分润记录分页查询
router.get('/Profit/detail', Controllers.Profit.detail) //分润详情
router.get('/merchantList/page', Controllers.MerchantList.page) //商户列表分页查询
router.get('/merchantList/getUrl', Controllers.MerchantList.getDesUrl) //获取代理商进件url
router.get('/keyManage/info', Controllers.KeyManage.info) //获去商户公钥信息
router.post('/keyManage/add', Controllers.KeyManage.add) //添加商户公钥信息
router.put('/keyManage/update', Controllers.KeyManage.update) //修改商户公钥信息
router.get('/merchantInfo/page', Controllers.MerchantInfo.page) //商户费率分页查询（签约产品）
router.get('/merchantInfo/mercBusiInfo', Controllers.MerchantInfo.mercBusiInfo) //商户经营信息查询
router.get('/merchantInfo/mercStateInfo', Controllers.MerchantInfo.mercStateInfo) //商户结算信息查询
router.put('/merchantInfo/mercInfoUpdate', Controllers.MerchantInfo.mercSuperUpdate) //更新商户基本信息
router.put('/merchantInfo/mercStateInfoUpdate', Controllers.MerchantInfo.mercStateInfoUpdate) //更新商户结算信息
router.get('/common/bankList', Controllers.Common.bankList) //银行列表查询
router.get('/common/lbankList', Controllers.Common.lbankList) //支行列表查询
router.get('/common/cityList', Controllers.Common.cityList) //地区列表查询
router.get('/order/notifyReissue', Controllers.Order.notifyReissue)// 补发通知
router.post('/order/refundApply', Controllers.Order.refundApply)// 退款申请
router.get('/profitSettle/list', Controllers.ProfitSettle.list)// 分润结算信息查询
router.get('/profitApply/page', Controllers.ProfitApply.page)// 分润结算申请信息分页查询
router.get('/profitSettle/initProfitData', Controllers.ProfitSettle.initProfitData)// 分润结算申请初始化
router.post('/profitSettle/openApply', Controllers.ProfitSettle.openApply)// 开始申请，获取applyuuid
router.post('/profitSettle/bindApply', Controllers.ProfitSettle.bindApply)// 选择日期
router.post('/profitSettle/lockDate', Controllers.ProfitSettle.lockDate)// 确认日期
router.post('/profitSettle/saveApply', Controllers.ProfitSettle.saveApply)// 提交申请
router.post('/profitApply/againApply', Controllers.ProfitApply.againApply)// 重新提交
router.post('/profitApply/cancelApply', Controllers.ProfitApply.cancelApply)// 取消申请操作

// 角色信息管理
router.get('/roleManage/menuInfo', Controllers.RoleManage.menuInfo) // 获取菜单信息
router.get('/roleManage/rolePage', Controllers.RoleManage.rolePage) // 角色分页查询
router.post('/roleManage/roleSave', Controllers.RoleManage.roleSave) // 角色添加
router.put('/roleManage/roleUpdate', Controllers.RoleManage.roleUpdate) // 角色编辑
router.delete('/roleManage/roleDelete', Controllers.RoleManage.roleDelete) // 角色删除

//操作员信息管理
router.get('/oprManage/oprInfoPage', Controllers.OprManage.oprInfoPage) //操作员信息分页查询
router.post('/oprManage/oprAdd', Controllers.OprManage.oprAdd) //操作员信息添加
router.put('/oprManage/modifyOprInfo', Controllers.OprManage.modifyOprInfo) //操作员信息修改
router.put('/oprManage/modifyOprStatus', Controllers.OprManage.modifyOprStatus) //操作员状态修改
router.get('/oprManage/oprStsPage', Controllers.OprManage.oprStsPage) //操作员状态修改信息分页
router.get('/oprManage/queryOprisExist', Controllers.OprManage.queryOprisExist) //查询操作员是否存在

//密码管理
router.post('/security/modifyLoginPwd', Controllers.Security.modifyLoginPwd)// 修改登录密码
router.post('/security/modifyPayPwd', Controllers.Security.modifyPayPwd)// 修改支付密码
router.post('/security/setPayPwd', Controllers.Security.setPayPwd)// 设置支付密码
router.post('/security/resetPayPwd', Controllers.Security.resetPayPwd)// 重置支付密码

//ca证书管理
router.get('/ca/detail', Controllers.Ca.caDetail) //获取ca证书详情
router.post('/ca/init', Controllers.Ca.caInit) //ca证书初始化
router.post('/ca/install', Controllers.Ca.caInstall) //安装ca证书
router.get('/ca/page', Controllers.Ca.caPage) //ca证书分页查询
router.post('/ca/Revoke', Controllers.Ca.caRevokeOne) //吊销ca证书

//下载 生成excel
router.get('/download/order/madeFile', Controllers.Download.orderTranDataExcel) //订单管理生成excel
router.get('/download/statement/madeFile', Controllers.Download.statementDataExcel) //结算信息/生成excel
router.get('/download/refund/madeFile', Controllers.Download.refundDataExcel) //退款信息/生成excel
router.get('/download/paymentList/madeFile', Controllers.Download.paymentListDataExcel) //付款信息/生成excel
router.get('/download/freeze/madeFile', Controllers.Download.freezeDataExcel) //冻结信息/生成excel
router.get('/download/chargeList/madeFile', Controllers.Download.chargeListDataExcel) //充值信息/生成excel
router.get('/download/withdrawList/madeFile', Controllers.Download.withdrawListDataExcel) //提现信息/生成excel
router.get('/download/merchantList/madeFile', Controllers.Download.merchantListDataExcel) //商户列表/生成excel
router.get('/download/profit/madeFile', Controllers.Download.profitDataExcel) //分润列表/生成excel



//获取下载地址
router.get(`/download/order/createUrl`, Controllers.Download.excelQueryStatus_order)//获取下载地址 order服务
router.get(`/download/posp/createUrl`, Controllers.Download.excelQueryStatus_posp)//获取下载地址//posp服务
router.get(`/download/merc/createUrl`, Controllers.Download.excelQueryStatus_merc)//获取下载地址//merc服务
router.get(`/download/pss/createUrl`, Controllers.Download.excelQueryStatus_pss)//获取下载地址//pss服务
router.get(`/download/acm/createUrl`, Controllers.Download.excelQueryStatus_acm)//获取下载地址//acm服务
module.exports = router