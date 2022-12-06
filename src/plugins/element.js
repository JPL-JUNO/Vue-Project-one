import Vue from 'vue'
// 主动操作的弹出提示框
import { Message } from 'element-ui'
import { Button, Form, FormItem, Input } from 'element-ui'
import { Container, Header, Aside, Main } from 'element-ui'

import { Menu, Submenu, MenuItem } from 'element-ui'

import { Breadcrumb, BreadcrumbItem } from 'element-ui'
import { Card } from 'element-ui'

import { Row, Col } from 'element-ui'

import { Table, TableColumn } from 'element-ui'
import { Switch } from 'element-ui'

import { Tooltip } from 'element-ui' 

import { Pagination } from 'element-ui'

import { Dialog } from 'element-ui'

import { MessageBox } from 'element-ui'
import { Tag } from 'element-ui'
import { Tree } from 'element-ui'

import { Select, Option} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Col)
Vue.use(Row)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
// 和上面几个不同，需要挂载到Vue原型对象上
Vue.prototype.$message = Message

Vue.prototype.$confirm = MessageBox.confirm