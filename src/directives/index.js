export const imageerror = {
  // 指令对象，会在当前的dom元素插入节点之后执行
  inserted(dom, options) {
    // dom表示当前指令作用 dom对象

    // 初始化的时候，看dom.src是否有值，有值就赋值，没值就给赋值option.value
    dom.src = dom.src || options.value

    // 当图片有地址，但是地址没有加载成功的时候，会报错，会触发图片事件onerror
    dom.onerror = () => {
      // 图片异常时，会将指令配置的默认图片设置为该图片内容
      /**
       * options和<img v-imageerror="默认图片变量" />中的默认图片变量相关。
       * 例如，在NavBar的template中，有<img v-imageerror="defaultAvatar" />
       * 在script的data中，有data(){return {defaultAvatar: '@/src/assets/a.png'}}
       * options.value = '@/src/assets/a.png'
       */
      dom.src = options.value
    }
  },
  componentUpdated(dom, options) {
    // componentUpdated(dom, options)会在当前指令作用的组件更新数据完毕之后执行
    // inserted(dom, options)只会执行一次。组件初始化后，一旦更新，就不会再次进入inserted(dom, options)，会进入componentUpdated(dom, options)。
    // 在这种情况下：created() {img.src= null} （img被赋值了一个空的地址），不会触发inserted(dom, options)
    dom.src = dom.src || options.value
  }
}
