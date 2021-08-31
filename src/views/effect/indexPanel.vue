<template>
  <div class="index-panel">
    <div class="search-box ranking">
      <div>
        <!-- 时间选择 -->
        <a-range-picker
          v-model="dtime"
          :disabledDate="disabledDate"
          format="YYYY-MM-DD"
          :showToday="false"
          style="width: 230px"
        >
        </a-range-picker>
        <!-- 部门选择 -->
        <a-select
          v-model="parentDeptId"
          :maxTagCount="1"
          placeholder="事业部名称"
          mode="tags"
          style="width: 160px"
          @change="parentDeptIdChange"
        >
          <a-select-option
            v-for="item in parentDeptList"
            :key="item.parentDeptId"
            :value="item.parentDeptId"
            >{{ item.parentDeptName }}</a-select-option
          >
        </a-select>
        <a-select
          v-model="deptId"
          :maxTagCount="1"
          placeholder="部门名称"
          mode="tags"
          style="width: 160px"
        >
          <a-select-option
            v-for="item in secondDeptList"
            :key="item.deptId"
            :value="item.deptId"
            >{{ item.deptName }}</a-select-option
          >
        </a-select>
        <a-select
          v-model="campaignTypeId"
          :maxTagCount="1"
          placeholder="请选择项目类型"
          mode="tags"
          style="width: 160px"
        >
          <a-select-option
            v-for="item in keyIndexProjectType"
            :key="item.campaignTypeId"
            :value="item.campaignTypeId"
            >{{ item.campaignTypeName }}</a-select-option
          >
        </a-select>
        <!-- <a-select
          v-model="mediaId"
          :maxTagCount="1"
          placeholder="请选择媒体"
          mode="tags"
          style="width: 230px"
        >
          <a-select-option
            v-for="item in keyIndexMedia"
            :key="item.mediaId"
            :value="item.mediaId"
            >{{ item.mediaName }}</a-select-option
          >
        </a-select> -->
        <MediaComponent
          placeholder="请选择媒体"
          :options="keyIndexMedia"
          v-model="mediaId"
          mode="multiple"
          style="width: 160px"
        >
        </MediaComponent>
      </div>
      <div>
        <a-button @click="reset"> 重置 </a-button>
        <a-button type="primary" @click="getKeyIndexBoardData"> 查询 </a-button>
      </div>
    </div>
    <a-spin :spinning="loading">
      <div class="content">
        <div v-if="Object.keys(keyIndexBoardData).length">
          <index-card
            height="160px"
            width="422px"
            :value="keyIndexBoardData.totalList[0]"
            @toDetail="toDetail(keyIndexBoardData.totalList[0])"
          ></index-card>
          <template v-for="(item, key) in keyIndexBoardData">
            <div class="index-list" v-if="key != 'totalList'" :key="key">
              <div class="card-list">
                <index-card
                  v-for="item in openMore[key]
                    ? keyIndexBoardData[key]
                    : keyIndexBoardData[key].slice(0, 6)"
                  :key="item.type"
                  :keys="key"
                  :value="item"
                  @toDetail="toDetail(item)"
                ></index-card>
              </div>
              <div class="unfold" @click="openMore[key] = !openMore[key]">
                <a-icon type="up" v-if="openMore[key]" />{{
                  openMore[key + "Name"]
                }}<a-icon type="down" v-if="!openMore[key]" />
              </div>
            </div>
          </template>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import { mapState } from "vuex";
import IndexCard from "@/components/IndexCard/IndexCard.vue";
import moment from "moment";
import MediaComponent from "@/components/MediaComponent/index";
import {
  getDeptList,
  getKeyIndexBoardData,
  getKeyIndexDayDataList,
  getKeyIndexMedia,
  getKeyIndexProjectType,
  getParentDeptList,
} from "@/service/effect/keyIndexController";
export default {
  name: "IndexPanel",
  components: {
    IndexCard,
    MediaComponent,
  },
  data() {
    return {
      openMore: {
        amountList: false,
        amountListName: "展 开 量 级 指 标",
        costList: false,
        costListName: "展 开 成 本 指 标",
        rateList: false,
        rateListName: "展 开 转 化 率 指 标",
      },
      dtime: null,
      deptList: [], // 二级部门组件数据
      parentDeptList: [], // 一级部门组件数据
      keyIndexBoardData: [], // 关键指标看板数据
      keyIndexDayDataList: {}, // 关键指标看板时间组件数据
      keyIndexMedia: [], // 媒体组件数据
      keyIndexProjectType: [], // 项目类型组件数据
      parentDeptId: [], // 一级部门选择
      deptId: [], // 二级部门选择
      campaignTypeId: [], // 项目类型选择
      mediaId: [], // 媒体id
      loading: true, // loading状态
    };
  },
  methods: {
    // 查询部门组件数据
    async getDeptList() {
      try {
        const res = await getDeptList();
        this.deptList = res.data;
      } catch (error) {
        console.error(error);
      }
    },
    // 获取关键指标看板数据
    async getKeyIndexBoardData() {
      const {
        dtime,
        parentDeptId,
        deptId,
        campaignTypeId,
        mediaId,
        flowTypeId,
      } = this;
      this.loading = true;
      try {
        const time = [
          moment(dtime[0]).format("YYYY-MM-DD"),
          moment(dtime[1]).format("YYYY-MM-DD"),
        ];

        const obj = {
          dtime: time.join(","),
          campaignTypeId: campaignTypeId.join(","),
          mediaId: mediaId.map((item) => item.id).join(","),
          flowTypeId: flowTypeId,
        };
        if (deptId.length) {
          obj.deptId = deptId.join(",");
        } else {
          obj.parentDeptId = parentDeptId.join(",");
        }
        const res = await getKeyIndexBoardData(obj);
        this.keyIndexBoardData = res.data;
      } catch (error) {
        console.error(error);
      }
      this.loading = false;
    },
    // 获取关键指标看板时间组件数据
    async getKeyIndexDayDataList() {
      try {
        const res = await getKeyIndexDayDataList();
        this.keyIndexDayDataList = res.data;
        // this.dtime = [moment("2021-06-01"), moment("2021-06-30")];
        this.dtime = [
          moment(this.keyIndexDayDataList.endTime),
          moment(this.keyIndexDayDataList.endTime),
        ];
      } catch (error) {
        console.error(error);
      }
    },
    // 查询媒体组件数据
    async getKeyIndexMedia() {
      try {
        const res = await getKeyIndexMedia();
        this.keyIndexMedia = res.data.map((item) => {
          return {
            name: item.mediaName,
            id: item.mediaId,
          };
        });
      } catch (error) {
        console.error(error);
      }
    },
    // 查询项目类型组件数据
    async getKeyIndexProjectType() {
      try {
        const res = await getKeyIndexProjectType();
        this.keyIndexProjectType = res.data;
      } catch (error) {
        console.error(error);
      }
    },
    async getParentDeptList() {
      try {
        const res = await getParentDeptList();
        this.parentDeptList = res.data;
      } catch (error) {
        console.error(error);
      }
    },
    // 禁选时间
    disabledDate(current) {
      return (
        moment(this.keyIndexDayDataList.startTime, "YYYY-MM-DD") > current ||
        current > moment(this.keyIndexDayDataList.endTime, "YYYY-MM-DD")
      );
    },
    // 一级部门选择回调
    parentDeptIdChange() {
      const { deptId } = this;
      const deptIdLis = [];
      this.secondDeptList.forEach((item, i) => {
        if (deptId.indexOf(item.deptId) > -1) {
          deptIdLis.push(item.deptId);
        }
      });
      this.deptId = deptIdLis;
    },
    // 重置数据
    reset() {
      this.parentDeptId = []; // 一级部门选择
      this.deptId = []; // 二级部门选择
      this.campaignTypeId = []; // 项目类型选择
      this.mediaId = []; // 媒体id
      this.dtime = [
        moment(this.keyIndexDayDataList.endTime),
        moment(this.keyIndexDayDataList.endTime),
      ];
    },
    toDetail(item) {
      const {
        dtime,
        parentDeptId,
        deptId,
        campaignTypeId,
        mediaId,
        flowTypeId,
      } = this;
      this.$router.push({
        path: "/effect/trendAnalysis",
        query: {
          time: [
            dtime[0].format("YYYY-MM-DD"),
            dtime[1].format("YYYY-MM-DD"),
          ].join(","),
          mediaId: mediaId.length ? JSON.stringify(mediaId) : "",
          campaignTypeId: campaignTypeId.join(","),
          deptId: deptId.join(","),
          parentDeptId: parentDeptId.join(","),
          dateTypeId: item.subIndexId,
        },
      });
    },
  },
  computed: {
    ...mapState({
      flowTypeId: (state) => state.effectDataType,
    }),
    // 二级部门列表
    secondDeptList() {
      const { parentDeptId, deptList } = this;
      let lis = [];
      if (parentDeptId.length) {
        for (let i = 0, len = parentDeptId.length; i < len; i++) {
          for (let index = 0, len = deptList.length; index < len; index++) {
            if (
              Number(parentDeptId[i]) === Number(deptList[index].parentDeptId)
            ) {
              lis = [...lis, deptList[index]];
            }
          }
        }
      } else {
        lis = [...deptList];
      }
      return lis;
    },
  },
  async mounted() {
    this.getDeptList();
    this.getParentDeptList();
    this.getKeyIndexMedia();
    this.getKeyIndexProjectType();
    await this.getKeyIndexDayDataList();
    this.getKeyIndexBoardData();
  },
};
</script>
<style lang="less" scoped>
.content {
  overflow: auto;
  min-height: 200px;
}
.content > div {
  width: 1340px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
  .card-list {
    width: 1286px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    > div {
      margin: 0 10px 10px 0;
    }
    > div:nth-child(6n) {
      margin-right: 0;
    }
  }
}
.index-list {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.unfold {
  width: 44px;
  height: 150px;
  background: #ffffff;
  opacity: 1;
  border-radius: 8px;
  font-size: 12px;
  line-height: 16px;
  font-weight: 400;
  padding: 20px 16px;
  cursor: pointer;
}
</style>
