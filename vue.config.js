// vue.config.js

const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}
const Webpack = require("webpack");
module.exports = {
  publicPath: "/",
  outputDir: "dist",
  productionSourceMap: false,
  devServer: {
    port: 9000,
    proxy: {
      "/baseUrl": {
        target:
          "http://alb-96ckwo6ththodzw88x.cn-shenzhen.alb.aliyuncs.com/byd",
        // target: "http://192.168.20.42:7100/",
        // target: "http://192.168.20.33:7100/",
        // target: "http://192.168.20.10:7100/",
        changeOrigin: true,
        pathRewrite: {
          "^/baseUrl": "",
        },
      },
    },
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            "primary-color": "#0073C6",
          },
          javascriptEnabled: true,
        },
      },
    },
  },
  chainWebpack: (config) => {
    config.resolve.alias.set("@", resolve("src"));

    config.plugin("html").tap((args) => {
      args[0].title = "BYD-灵犀AI运营管理平台";
      return args;
    });

    config.output
      .filename("js/[name].[hash].js")
      .chunkFilename("js/[name].[hash].js");
    config
      .plugin("IgnorePlugin")
      .use(new Webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));
  },
  // configureWebpack: (config) => {
  //   // 生产环境下生效
  //   // if (process.env.NODE_ENV === "production") {
  //   //   // 配置删除 console.log
  //   //   config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
  //   // }
  // },
};
