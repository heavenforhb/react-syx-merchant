import MicroService from '../utils/MicroService'
import provider from '../provider'
import { success, error } from './Base'

export async function page(ctx) {
  try {
    const { 
      page = 1, size
    } = ctx.request.query

    const list = await MicroService.request(ctx, provider.noticePage, {
      pageNumber: page, pageSize: size
    })
    
    success(ctx)(list)
  } catch(e) {
    error(ctx)(e)
  }
}