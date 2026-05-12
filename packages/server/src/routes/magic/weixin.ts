import Router from '@koa/router'
import * as ctrl from '../../controllers/magic/weixin'

export const weixinRoutes = new Router()

weixinRoutes.get('/api/magic/weixin/qrcode', ctrl.getQrcode)
weixinRoutes.get('/api/magic/weixin/qrcode/status', ctrl.pollStatus)
weixinRoutes.post('/api/magic/weixin/save', ctrl.save)
