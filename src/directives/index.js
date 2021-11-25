export const imageerror = {
  // 指令对象，会在当前的dom元素插入节点之后执行
  inserted(dom, options) {
    // dom表示当前指令作用 dom对象
    // 当图片有地址，但是地址没有加载成功的时候，会报错，会触发图片事件onerror
    dom.onerror = function () {
      // 图片异常时，会将指令配置的默认图片设置为该图片内容
      /**
       * options和<img v-imageerror="默认图片变量" />中的默认图片变量相关。
       * 例如，在NavBar的template中，有<img v-imageerror="defaultAvatar" />
       * 在script的data中，有data(){return {defaultA: '@/src/assets/a.png'}}
       * options.value = '@/src/assets/a.png'
       */
      dom.src = options.value
    }
  }
}
