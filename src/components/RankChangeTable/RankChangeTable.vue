<template>
  <div class="rank-change">
    <a-table
      :columns="rankChangeColumns"
      :data-source="sourceValue"
      :scroll="{ x: 'max-content' }"
      :pagination="false"
      :loading="loading"
    >
    </a-table>
    <div class="more-btn" @click="toogleShowMore">
      <div v-if="showTopTen">
        <span>更多</span>
        <a-icon type="down"></a-icon>
      </div>

      <div v-else>
        <span>收起</span>
        <a-icon type="up"></a-icon>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    dataSource: {
      type: Object,
      default: () => ({}),
    },
    title: {
      type: String,
      default: "PV",
    },
    rankTypeId: {
      type: [String, Number],
      default: 1,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showTopTen: true,
      rankChangeColumns: [],
      sourceValue: [],
    };
  },
  methods: {
    toogleShowMore() {
      this.showTopTen = !this.showTopTen;
      this.setSourceValue();
    },
    setRankChangeColumns() {
      const startTime = this.dataSource.startTime;
      const endTime = this.dataSource.endTime;
      const initStr = () => {
        if (this.rankTypeId == 1) {
          return "月";
        }
        if (this.rankTypeId == 2) {
          return "季度";
        }
        return "年";
      };
      const str = initStr();
      const newColumns = [];
      if (this.rankTypeId == 3) {
        const diffDate = endTime - startTime + 1;
        let yearList = [];
        for (let i = endTime; i >= startTime; i--) {
          yearList.push(i);
        }
        for (let i = 1; i <= diffDate; i++) {
          newColumns.push({
            dataIndex: `cell${i}`,
            key: `cell${i}`,
            title: `${yearList[i - 1]}${str}`,
            align: "center",
            customRender: (text, record, index) => {
              if (text) {
                return (
                  <div class="changeTable-cell">
                    <p>{text.name}</p>
                    <p class="cell-value">{text.value}</p>
                  </div>
                );
              } else {
                return <div></div>;
              }
            },
          });
        }
      } else {
        for (let i = endTime; i >= startTime; i--) {
          newColumns.push({
            dataIndex: `cell${i}`,
            key: `cell${i}`,
            title: `${i}${str}`,
            align: "center",
            customRender: (text, record, index) => {
              if (text) {
                return (
                  <div class="changeTable-cell">
                    <p>{text.name}</p>
                    <p class="cell-value">{text.value}</p>
                  </div>
                );
              } else {
                return <div></div>;
              }
            },
          });
        }
      }
      this.rankChangeColumns = [
        {
          dataIndex: "key",
          key: "key",
          title: this.title,
          align: "center",
          customRender: (text, record, index) => {
            return <span>No.{index + 1}</span>;
          },
        },
        ...newColumns,
      ];
    },
    setSourceValue() {
      if (this.dataSource.list.length) {
        if (this.dataSource.list.length < 10) {
          this.sourceValue = this.dataSource.list;
        }

        if (this.showTopTen) {
          this.sourceValue = this.dataSource.list.slice(0, 10);
        } else {
          this.sourceValue = this.dataSource.list;
        }
      } else {
        this.sourceValue = [];
      }
    },
  },
  mounted() {
    this.setRankChangeColumns();
  },
  computed: {},
  watch: {
    dataSource(newVal) {
      this.setRankChangeColumns();
      this.setSourceValue();
    },
    rankChangeColumns(newVal) {},
    title(newVal) {
      this.setRankChangeColumns();
    },
  },
};
</script>
<style lang="less" scoped>
.rank-change {
  .changeTable-cell {
    p {
      margin: 0;
      color: #212121;
    }
    .cell-value {
      color: #7e8294;
    }
  }
}
.more-btn {
  margin: 10px auto;
  width: 100px;
  text-align: center;
  color: #8d8e99;
  cursor: pointer;
  transition: all 0.2s linear;
  &:hover {
    opacity: 0.6;
  }
}
</style>
