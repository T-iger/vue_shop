import Vue from 'vue'
import { Button, MessageBox, Submenu, Dropdown, Avatar, Pagination, Tooltip, Switch, Table, TableColumn, Row, Col, Card, Breadcrumb, BreadcrumbItem, Select, Dialog, Option, DropdownItem, DropdownMenu, Menu, MenuItem, Form, FormItem, Input, Message, Container, Header, Aside, Main } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Submenu)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Select)
Vue.use(Dialog)
Vue.use(Option)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Avatar)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
