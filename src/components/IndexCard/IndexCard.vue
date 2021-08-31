<template>
  <div class="cards" :style="{ width, height }">
    <p class="title">
      <span class="classify">
        <slot name="icon">
          <span
            class="icon"
            :style="{
              backgroundColor: backgroundColor,
              backgroundImage: 'url(' + imgUrl(value.type) + ')',
            }"
          ></span>
        </slot>
        <span>{{ value.name }}</span>
      </span>
      <span class="skip" @click="toDetail">
        <slot name="skip"> 详情 <a-icon type="right" /> </slot>
      </span>
    </p>
    <div class="content">
      <p>
        <span class="ratio" v-if="value.overall && value.value != '-'">
          {{ value.value }}{{ keys == "rateList" ? "%" : ""
          }}<span>/{{ value.overall }}{{ keys == "rateList" ? "%" : "" }}</span>
        </span>
        <span class="quantity" v-if="!value.overall && value.value != '-'"
          >{{ value.value }}{{ keys == "rateList" ? "%" : "" }}</span
        >
      </p>
      <div class="status">
        <span>环比</span>
        <div style="height: 14px; width: 14px">
          <img
            v-if="
              value.percent.indexOf('-') > -1 &&
              value.percent != '-' &&
              value.percent != 0
            "
            style="height: 14px; width: 14px"
            src="@/assets/img/depreciate.png"
            alt=""
          />
          <img
            v-if="
              value.percent.indexOf('-') == -1 &&
              value.percent != '-' &&
              value.percent != 0
            "
            style="height: 14px; width: 14px"
            src="@/assets/img/rise.png"
            alt=""
          />
        </div>
        <span
          style="width: 50px"
          :style="{
            color: value.percent.indexOf('-') > -1 ? '#46c265' : '#F76363',
          }"
          >{{ value.percent != "-" ? value.percent : ""
          }}{{ keys != "costList" && value.percent != "-" ? "%" : "" }}</span
        >
      </div>
    </div>
  </div>
</template>
<script>
const costImg = require("@/assets/img/cost.png");
const carImg = require("@/assets/img/car.png");
const clickImg = require("@/assets/img/click.png");
const clueImg = require("@/assets/img/clue.png");
const eyeImg = require("@/assets/img/eye.png");
const handshakeImg = require("@/assets/img/handshake.png");
export default {
  props: {
    width: {
      type: String,
      default: "206px",
    },
    height: {
      type: String,
      default: "150px",
    },
    value: {
      type: Object,
      default: () => ({}),
    },
    keys: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      cost: [
        "totalCost",
        "pvCost",
        "uvCost",
        "clickCost",
        "impCost",
        "effClickCost",
      ],
      eye: ["pvValue", "imp", "effImp", "uvValue", "effImpRate", "effImpCost"],
      car: ["driveCost", "driveRate", "driveNum"],
      click: ["click", "clickChain", "effClick", "clickRate", "effClickRate"],
      clue: [
        "leads",
        "leadsCost",
        "effLeadsCost",
        "retainedRate",
        "effLeadsRate",
        "effLeads",
      ],
      handshake: [
        "dealNum",
        "directDealNum",
        "directDealCost",
        "dealRate",
        "dealCost",
        "directDealRate",
      ],
    };
  },
  mounted() {},
  computed: {
    imgUrl(type) {
      return function (type) {
        if (this.eye.indexOf(type) > -1) {
          return eyeImg;
        } else if (this.cost.indexOf(type) > -1) {
          return costImg;
        } else if (this.car.indexOf(type) > -1) {
          return carImg;
        } else if (this.click.indexOf(type) > -1) {
          return clickImg;
        } else if (this.clue.indexOf(type) > -1) {
          return clueImg;
        } else if (this.handshake.indexOf(type) > -1) {
          return handshakeImg;
        }
      };
    },
    backgroundColor() {
      let color = "";
      if (this.keys == "amountList") {
        color = "#2369F6";
      } else if (this.keys == "rateList") {
        color = "#0697F8";
      } else {
        return "#276AC1";
      }
      return color;
    },
  },
  methods: {
    toDetail() {
      this.$emit("toDetail");
    },
  },
};
</script>
<style lang="less" scoped>
.cards {
  border-radius: 8px;
  background-color: #fff;
  padding: 10px;
  display: flex;
  flex-direction: column;
  .classify {
    font-size: 16px;
    color: #595959;
    font-weight: 400;
    display: flex;
    align-items: center;
    .icon {
      display: inline-block;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      margin-right: 10px;
      background-size: 16px;
      background-repeat: no-repeat;
      background-position: center;
    }
  }
  .title {
    display: flex;
    justify-content: space-between;
  }
  .skip {
    color: #0073c6;
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .content {
    display: flex;
    flex-direction: column;
    margin-top: 30px;
    > p,
    div {
      display: flex;
      justify-content: center;
    }
    > p {
      height: 36px;
    }
    .ratio {
      font-size: 24px;
      color: #212121;
      font-weight: bold;
      > span {
        font-size: 14px;
        color: #999999;
      }
    }
    .quantity {
      font-size: 24px;
      color: #212121;
      font-weight: bold;
    }
    .status {
      display: flex;
      align-items: center;
      font-size: 14px;
      margin-top: 10px;
      > :nth-child(1) {
        color: #999999;
      }
      > :nth-child(2) {
        margin: 0 15px;
      }
    }
  }
}
p {
  margin-bottom: 0;
}
</style>
