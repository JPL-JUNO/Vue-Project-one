const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 取消对一个变量、文件命名的检查
  lintOnSave: false,
})
