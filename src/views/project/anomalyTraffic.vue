<template>
  <div>
    <div class="search-box effect">
      <div class="top">
        <a-checkbox-group
          :options="[
            { label: '总体', value: 1 },
            { label: '事业部', value: 2 },
          ]"
          :value="[2]"
        >
          总体
        </a-checkbox-group>
      </div>
      <div class="bottom">
        <div>
          <!-- 日期选择 -->
          <a-range-picker style="width: 230px" />
          <!-- 事业部 -->
          <a-select
            placeholder="事业部名称"
            mode="multiple"
            style="width: 160px"
            :maxTagCount="1"
          >
            <a-select-option :value="1"> 王朝网销售事业部 </a-select-option>
          </a-select>

          <!-- 部门 -->
          <a-select
            placeholder="部门名称"
            mode="multiple"
            style="width: 160px"
            :maxTagCount="1"
          >
            <a-select-option :value="1"> 部门 </a-select-option>
          </a-select>

          <!-- 媒体 -->
          <MediaComponent
            placeholder="请选择媒体"
            :options="[]"
            mode="multiple"
            style="width: 160px"
          >
          </MediaComponent>
          <!-- 投放状态 -->
          <a-select
            placeholder="投放状态"
            mode="multiple"
            style="width: 160px"
            :maxTagCount="1"
          >
            <a-select-option :value="1"> 投放中 </a-select-option>
          </a-select>
        </div>
        <div>
          <a-button>重置</a-button>
          <a-button type="primary">查询</a-button>
        </div>
      </div>
    </div>
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :scroll="{ x: 'max-content' }"
      :pagination="pageOptions"
      :loading="loading"
    ></a-table>
  </div>
</template>
<script>
import MediaComponent from "@/components/MediaComponent/index";
export default {
  name: "anomalyTraffic",
  components: { MediaComponent },
  data() {
    return {
      pageOptions: {},
      dataSource: [],
      loading: true,
    };
  },
  computed: {
    columns() {
      const columns = [
        {
          title: "",
          dataIndex: "null",
        },
        {
          title: "SPID",
          dataIndex: "SPID",
          align: "center",
          sorterId: "14",
          sorter: true,
          sortOrder: "",
        },
        {
          title: "媒体",
          dataIndex: "media",
          align: "center",
          sorterId: "14",
          sorter: true,
          sortOrder: "",
        },
        {
          title: "频道",
          dataIndex: "channel",
          align: "center",
          sorterId: "14",
          sorter: true,
          sortOrder: "",
        },
        {
          title: "广告位",
          dataIndex: "advertising",
          align: "center",
          sorterId: "14",
          sorter: true,
          sortOrder: "",
        },
        {
          title: "UnFiltered.Imp",
          dataIndex: "UnFiltered",
          align: "center",
          sorterId: "14",
          sorter: true,
          sortOrder: "",
        },
        {
          title: "GIVT NET.Imp",
          dataIndex: "GIVT",
          align: "center",
          sorterId: "14",
          sorter: true,
          sortOrder: "",
        },
        {
          title: "TOTAL NET.Imp",
          dataIndex: "TOTAL",
          align: "center",
          sorterId: "14",
          sorter: true,
          sortOrder: "",
        },
        {
          title: "GIVT.Imp",
          dataIndex: "GIVT1",
          align: "center",
          sorterId: "14",
          sorter: true,
          sortOrder: "",
        },
        {
          title: "GIVT.Imp占比",
          dataIndex: "GIVT2",
          align: "center",
          sorterId: "14",
          sorter: true,
          sortOrder: "",
        },
      ];
      return columns;
    },
  },
  mounted() {
    setTimeout(() => {
      const lis = [];
      for (let index = 0; index < 4; index++) {
        lis.push({
          null: Math.floor(Math.random(0, 1) * 200),
          SPID: Math.floor(Math.random(0, 1) * 200),
          media: Math.floor(Math.random(0, 1) * 200),
          channel: Math.floor(Math.random(0, 1) * 200),
          advertising: Math.floor(Math.random(0, 1) * 200),
          UnFiltered: Math.floor(Math.random(0, 1) * 200),
          GIVT: Math.floor(Math.random(0, 1) * 200),
          TOTAL: Math.floor(Math.random(0, 1) * 200),
          GIVT1: Math.floor(Math.random(0, 1) * 200),
          GIVT2: Math.floor(Math.random(0, 1) * 200),
        });
      }
      this.dataSource = lis;
      this.loading = false;
    }, 2000);
  },
  methods: {
    projectDownload() {},
  },
};
</script>
