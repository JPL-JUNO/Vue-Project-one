import Vue from 'vue'
// 主动操作的弹出提示框
import { Message } from 'element-ui'
import { Button, Form, FormItem, Input }from 'element-ui'
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

// 和上面几个不同，需要挂载到Vue原型对象上
Vue.prototype.$message = Message