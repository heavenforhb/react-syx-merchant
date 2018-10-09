import MicroService from '../utils/MicroService'
import provider from '../provider'
import { success, error } from './Base'

export async function fetch(ctx) {
    try {
      const info = await MicroService.request(ctx, provider.keyPlat, {})
      const { publicKey } = info[0]
      success(ctx)(publicKey)
    } catch(e) {
      error(ctx)(e)
    }
  }