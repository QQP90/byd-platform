import Media from './media.vue'

/* 
 *  参数说明
 *    :placeholder 输入框默认文字 string
 *    :styleObj 样式 style
 * 
 *    :options 选项list array [
          {
            name: "58汽车",
            id: 1,
          },
          {
            name: "太平洋",
            id: 2,
          },
        ]
 *
 *    :values 已选list array [{
          name: "太平洋",
          id: 2,
        }]
 *
 *    @onConfirm 确定回调 function(values) 参数返回已选list
*/

export default Media