<template>
  <div class="data-ctn">
    <div class="quota-select">
      <a-select
        v-model="quotaId"
        style="width: 160px"
        placeholder="选择指标"
        @change="quotaSelect"
      >
        <!-- <a-select-option
            v-for="item in analysisSubjectList"
            :key="item.analysisSubjectTypeId"
            :value="item.analysisSubjectTypeId"
          >
            {{ item.analysisSubjectTypeName }}
          </a-select-option> -->
          <a-select-option value="aa">aa</a-select-option>
      </a-select>
    </div>

    <div>
      <LineCharts id="arrivalLineChart"></LineCharts>
    </div>

    <div class="table-ctn">
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :pagination="{
          pageSize: 10,
          current: current,
          total: total,
        }"
        @change="pageChange"
        :loading="loading"
      >
      </a-table>
    </div>
  </div>
</template>
<script>
import LineCharts from "@/components/LineCharts";
export default {
  components: { LineCharts },
  props: {
    params: {
      type: Object,
      default: () => ({}),
    }, // 搜索选项
  },
  data() {
    return {
      columns: [],
      dataSource: [],
      loading: true,
      current: 1,
      total: 10,
      quotaId: undefined,
    };
  },
  methods: {
    quotaSelect(value){
    },
    pageChange(page) {},
  },
};
</script>
<style lang="less" scoped>
.data-ctn {
  padding: 20px 10px 30px;
  width: 100%;
  min-height: 100px;
  background: #fff;

  .quota-select {
    float: right;
    margin-right: 30px;
  }

  .line-charts-ctn {
    margin-top: 52px;
  }

  .table-ctn {
    margin-top: 10px;
    padding: 0 100px;
  }
}
</style>
