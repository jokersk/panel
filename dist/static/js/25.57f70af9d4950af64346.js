webpackJsonp([25],{"1tOY":function(e,s,n){var t=n("n7ON");"string"==typeof t&&(t=[[e.i,t,""]]),t.locals&&(e.exports=t.locals);n("rjj0")("50815c5e",t,!0)},dy4A:function(e,s,n){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var t=n("IcnI"),i={inserted:function(e,s,n){var i=s.value,a=t.a.getters&&t.a.getters.roles;if(!(i&&i instanceof Array&&i.length>0))throw new Error("need roles! Like v-permission=\"['admin','editor']\"");var r=i;a.some(function(e){return r.includes(e)})||e.parentNode&&e.parentNode.removeChild(e)}},a=function(e){e.directive("permission",i)};window.Vue&&(window.permission=i,Vue.use(a)),i.install=a;var r=i,o={name:"directivePermission",components:{SwitchRoles:n("v5cR").a},directives:{permission:r},data:function(){return{key:1}},methods:{handleRolesChange:function(){this.key++}}},l={render:function(){var e=this,s=e.$createElement,n=e._self._c||s;return n("div",{staticClass:"app-container"},[n("switch-roles",{on:{change:e.handleRolesChange}}),e._v(" "),n("div",{key:e.key,staticStyle:{"margin-top":"30px"}},[n("span",{directives:[{name:"permission",rawName:"v-permission",value:["admin"],expression:"['admin']"}],staticClass:"permission-alert"},[e._v("\n      Only\n      "),n("el-tag",{staticClass:"permission-tag",attrs:{size:"small"}},[e._v("admin")]),e._v(" can see this\n    ")],1),e._v(" "),n("span",{directives:[{name:"permission",rawName:"v-permission",value:["editor"],expression:"['editor']"}],staticClass:"permission-alert"},[e._v("\n      Only\n      "),n("el-tag",{staticClass:"permission-tag",attrs:{size:"small"}},[e._v("editor")]),e._v(" can see this\n    ")],1),e._v(" "),n("span",{directives:[{name:"permission",rawName:"v-permission",value:["admin","editor"],expression:"['admin','editor']"}],staticClass:"permission-alert"},[e._v("\n      Both\n      "),n("el-tag",{staticClass:"permission-tag",attrs:{size:"small"}},[e._v("admin")]),e._v(" and\n      "),n("el-tag",{staticClass:"permission-tag",attrs:{size:"small"}},[e._v("editor")]),e._v(" can see this\n    ")],1)])],1)},staticRenderFns:[]};var c=n("VU/8")(o,l,!1,function(e){n("1tOY")},"data-v-2a5e3600",null);s.default=c.exports},n7ON:function(e,s,n){(e.exports=n("FZ+f")(!1)).push([e.i,"\n.app-container[data-v-2a5e3600] .permission-alert {\n  width: 320px;\n  margin-top: 30px;\n  background-color: #f0f9eb;\n  color: #67c23a;\n  padding: 8px 16px;\n  border-radius: 4px;\n  display: block;\n}\n.app-container[data-v-2a5e3600] .permission-tag {\n  background-color: #ecf5ff;\n}\n",""])},v5cR:function(e,s,n){"use strict";var t={render:function(){var e=this,s=e.$createElement,n=e._self._c||s;return n("div",[n("div",{staticStyle:{"margin-bottom":"15px"}},[e._v(e._s(e.$t("permission.roles"))+"： "+e._s(e.roles))]),e._v("\n  "+e._s(e.$t("permission.switchRoles"))+"：\n  "),n("el-radio-group",{model:{value:e.switchRoles,callback:function(s){e.switchRoles=s},expression:"switchRoles"}},[n("el-radio-button",{attrs:{label:"editor"}}),e._v(" "),n("el-radio-button",{attrs:{label:"admin"}})],1)],1)},staticRenderFns:[]},i=n("VU/8")({computed:{roles:function(){return this.$store.getters.roles},switchRoles:{get:function(){return this.roles[0]},set:function(e){var s=this;this.$store.dispatch("ChangeRoles",e).then(function(){s.$emit("change")})}}}},t,!1,null,null,null);s.a=i.exports}});