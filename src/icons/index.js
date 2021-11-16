import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon) // 所有引入的svg文件都可以通過svg-icon組件在項目中全局使用

const req = require.context('./svg', false, /\.svg$/) // 這行代碼意思：去./svg目錄下讀取所有後綴名為.svg的文件並引入到項目中。
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
