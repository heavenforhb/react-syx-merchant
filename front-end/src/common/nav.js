import dynamic from 'dva/dynamic'

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  return dynamic({
    app,
    models: () => models.map(m => import(`../models/${m}.js`)),
    component
  })
}

// nav data
export const getNavData = app => [
  {
    component: dynamicWrapper(app, [], () => import('../layouts/BasicLayout')),
    layout: 'BasicLayout',
    name: '首页', // for breadcrumb
    path: '/',
    children: [
      {
        name: '首页',
        icon: 'appstore',
        path: 'home',
        component: dynamicWrapper(app, [], () => import('../routes/Dashboard/Analysis/'))
      },
      {
        name: '交易中心',
        icon: 'bank',
        path: 'center',
        children: [
          {
            name: '交易管理',
            // icon: 'book',
            path: 'deal',
            children: [
              {
                name: '交易订单',
                path: 'order',
                component: dynamicWrapper(app, [], () => import('../routes/Trade/Order/'))
              },
              {
                name: '退款查询',
                path: 'refund',
                component: dynamicWrapper(app, [], () => import('../routes/Trade/Refund/'))
              }
            ]
          },
          {
            name: '资金管理',
            // icon: 'book',
            path: 'money',
            children: [
              {
                name: '账户收支明细',
                path: 'accountDetail',
                component: dynamicWrapper(app, [], () => import('../routes/Trade/AccountDetail/'))
              },
              {
                name: '充值',
                path: 'charge',
                component: dynamicWrapper(app, [], () => import('../routes/Trade/Charge/'))
              },
              {
                name: '充值记录',
                path: 'chargeList',
                component: dynamicWrapper(app, [], () => import('../routes/Trade/ChargeList/'))
              },
              {
                name: '提现',
                path: 'withdraw',
                component: dynamicWrapper(app, [], () => import('../routes/Trade/Withdraw/'))
              },
              {
                name: '提现记录',
                path: 'withdrawList',
                component: dynamicWrapper(app, [], () => import('../routes/Trade/WithdrawList/'))
              },
              {
                name: '冻结查询',
                path: 'freeze',
                component: dynamicWrapper(app, [], () => import('../routes/Trade/Freeze/'))
              },
            ]
          },
          {
            name: '付款管理',
            // icon: 'book',
            path: 'payment',
            children: [
              {
                name: '单笔付款申请',
                path: 'payment',
                component: dynamicWrapper(app, [], () => import('../routes/Trade/Payment/'))
              },
              {
                name: '批量付款申请',
                path: 'batchPayment',
                component: dynamicWrapper(app, [], () => import('../routes/Trade/Order/'))
              },
              {
                name: '付款记录',
                path: 'paymentList',
                component: dynamicWrapper(app, [], () => import('../routes/Trade/PaymentList/'))
              }
            ]
          },
          {
            name: '结算管理',
            // icon: 'book',
            path: 'statements',
            children: [
              {
                name: '结算明细',
                path: 'statementsDetail',
                component: dynamicWrapper(app, [], () => import('../routes/Trade/StatementsDetail/'))
              }
            ]
          }
        ]
      },
      {
        name: '账户管理',
        icon: 'book',
        path: 'account',
        children: [
          {
            name: '个人信息',
            path: 'oprInfo',
            component: dynamicWrapper(app, [], () => import('../routes/AccountDetail/OprInfo/'))
          },
          {
            name: '商户信息',
            path: 'merchantInfo',
            component: dynamicWrapper(app, [], () => import('../routes/AccountDetail/MerchantInfo/'))
          },
          {
            name: '操作员管理',
            path: 'oprManage',
            children: [
              {
                name: '角色管理',
                path: 'roleManage',
                component: dynamicWrapper(app, [], () => import('../routes/AccountDetail/RoleManage/'))
              },
              {
                name: '操作员管理',
                path: 'oprManage',
                component: dynamicWrapper(app, [], () => import('../routes/AccountDetail/OprManage/'))
              }
            ]
          }
        ]
      },
      {
        name: '代理商管理',
        icon: 'pay-circle-o',
        path: 'agent',
        children: [
          {
            name: '商户管理',
            path: 'merchantManage',
            children: [
              {
                name: '商户列表',
                path: 'merchantList',
                component: dynamicWrapper(app, [], () => import('../routes/Agent/MerchantList/'))
              }
            ]
          },
          {
            name: '分润管理',
            path: 'profit',
            children: [
              {
                name: '分润明细查询',
                path: 'profitDetail',
                component: dynamicWrapper(app, [], () => import('../routes/Agent/Profit/'))
              },
              {
                name: '分润结算管理',
                path: 'profitSettle',
                component: dynamicWrapper(app, [], () => import('../routes/Agent/ProfitSettle/'))
              },
              {
                name: '分润结算申请记录',
                path: 'profitApply',
                component: dynamicWrapper(app, [], () => import('../routes/Agent/ProfitApply/'))
              }
            ]
          },
          {
            name: '子商户交易订单',
            path: 'subOrder',
            component: dynamicWrapper(app, [], () => import('../routes/Agent/SubOrder/'))
          }
        ]
      },
      {
        name: '安全中心',
        icon: 'book',
        path: 'security',
        children: [
          {
            name: '登录密码',
            path: 'password',
            component: dynamicWrapper(app, [], () => import('../routes/Security/PassWord/'))
          },
          {
            name: '支付密码',
            path: 'payword',
            component: dynamicWrapper(app, [], () => import('../routes/Security/PayWord/'))
          },
          {
            name: '商户公钥维护',
            path: 'keyManage',
            component: dynamicWrapper(app, [], () => import('../routes/Security/KeyManage/'))
          },
          {
            name: '平台公钥下载',
            path: 'keyPlatform',
            component: dynamicWrapper(app, [], () => import('../routes/Security/KeyPlatform/'))
          },
          {
            name: '数字证书',
            path: 'cert',
            children: [
              {
                name: '数字证书管理',
                path: 'certManage',
                component: dynamicWrapper(app, [], () => import('../routes/Security/CertManage/'))
              },
              {
                name: '申请数字证书',
                path: 'certApply',
                component: dynamicWrapper(app, [], () => import('../routes/Security/CertApply/'))
              }
            ]
          }
        ]
      },
      {
        name: '数据统计',
        icon: 'credit-card',
        path: 'statistics',
        children: [
          {
            name: '按交易量统计',
            path: 'volume',
            component: dynamicWrapper(app, [], () => import('../routes/Statistics/Volume/'))
          }
        ]
      },
      {
        name: '平台公告',
        icon: 'desktop',
        path: 'notice',
        component: dynamicWrapper(app, [], () => import('../routes/Notice/Notice/'))
      },
      {
       name: '工单',
       // display: false,
       // icon: 'setting',
        path: 'workSheet',
        component: dynamicWrapper(app, [], () => import('../routes/WorkSheet/WorkSheet'))
      }
    ]
  },
  {
    component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    layout: 'UserLayout',
    name: '账户', // for breadcrumb
    path: '/user',
    children: [
      {
        name: '账户',
        icon: 'user',
        display: false,
        path: 'user',
        children: [
          {
            name: '登录',
            path: 'login',
            component: dynamicWrapper(app, [], () => import('../routes/User/Login'))
          }
        ]
      }
    ]
  }
]
