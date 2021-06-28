import { asyncRoutes, constantRoutes } from '@/router'
import {getRoutes} from '@/api/admin/menu'
 import Layout from '@/layout'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  // 循环每一个路由
  routes.forEach(route => {
    const tmp = { ...route }
    // 判断路由是否拥有权限
    if (hasPermission(roles, tmp)) {
      // 自己添加
      const component = tmp.component
      if (route.component) {
        if (component == 'Layout') {
          tmp.component = Layout
        } else {
          // 接口组件字符串转换成组件对象
          tmp.component = (resolve) => require([`@/views/${component}`], resolve)
        }
        // 判断是否拥有子路由
        if (tmp.children) {
          tmp.children = filterAsyncRoutes(tmp.children, roles)
        }
      } 
      

      res.push(tmp)
      
    }
  })
  res.push({path:'*',redirect:'/404',hidden:true})
  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    // return new Promise(resolve => {
    //   let accessedRoutes
    //   // accessedRoutes存的是有权限的路由，是一个数组
    //   if (roles.includes('admin')) {
    //     accessedRoutes = asyncRoutes || []
    //   } else {
    //     accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
    //   }
    //   commit('SET_ROUTES', accessedRoutes)
    //   resolve(accessedRoutes)
    // })
    
    return new Promise(resolve => {
      console.log("generateRoutes")
    // 请求后台数据替换src/router/index.js的asyncRoutes异步路由
    getRoutes().then(response => {
      console.log(response)
      // filterAsyncRoutes方法作权限过滤和数据转换，roles为登录用户角色ID集合，如：[1,2]
      let accessedRoutes = filterAsyncRoutes(response.data, roles)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  })
  }
  
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
