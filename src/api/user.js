import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'get',
    
  })
}

export function getInfo(token) {
  return request({
    url: '/pdf',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
