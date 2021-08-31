import Quota from './quota.vue'

/* 
 *  参数说明
 *    :placeholder 输入框默认文字 string
 *    :styleObj 样式 style
 *    :selectAll 能否全选 默认false boolean 
 *    :max 如果不能全选 自定义最大选择数量 默认2 number
 * 
 *    :options 选项list array [{
          name: "曝光纬度",
          id: 11,
          children: [
            {
              name: "曝光量",
              id: 1,
            },
            {
              name: "千次曝光成本",
              id: 2,
            },
          ],
        }]
 *
 *    :values 已选list array [{
          name: "曝光量",
          id: 1,
          parentId: 11,
        }]
 *
 *    @onConfirm 确定回调 function(values) 参数返回已选list
*/

export default Quota