import request from '@/utils/request'

export function getRoutes(token) {
    return request({
      url: '/asyncRouter',
      method: 'get',
      params: { token }
    })
  }