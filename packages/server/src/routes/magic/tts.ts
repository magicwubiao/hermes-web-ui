import Router from '@koa/router'
import * as ctrl from '../../controllers/magic/tts'

export const ttsRoutes = new Router()

ttsRoutes.post('/api/magic/tts', ctrl.generate)
ttsRoutes.post('/api/tts/proxy/audio/speech', ctrl.openaiProxy)
