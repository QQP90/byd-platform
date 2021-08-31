<template>
  <div class="user-ctn" v-if="userDetail">
    <div class="userInfo-ctn">
      <div
        class="userInfo-row"
        v-for="(item, index) in userInfoData"
        :key="index"
      >
        <div class="userInfo-icon">
          <a-icon :type="item.icon"></a-icon>
        </div>

        <div class="userInfo-detail">
          <span>{{ item.name }}：{{ userDetailData[index] }}</span>
          <p>
            <span
              class="modify-btn"
              v-if="item.modify"
              @click="openModify(item.key)"
              >点击修改</span
            >
          </p>
        </div>
      </div>
    </div>

    <div class="authority-ctn">
      <div class="left-ctn">
        <p class="title">模块权限</p>
        <a-table
          row-key="modelId"
          :rowClassName="rowClassName"
          :columns="modulesColumns"
          :data-source="modulesData"
          :pagination="false"
          :loading="modulesData.length === 0"
        ></a-table>
      </div>

      <div class="right-ctn" v-if="userDetail.userType == 0">
        <p class="title">项目权限</p>
        <a-table
          row-key="deptId"
          :rowClassName="rowClassName"
          :columns="projectColumns"
          :data-source="projectData"
          :pagination="false"
          :loading="projectData.length === 0"
        ></a-table>
      </div>
    </div>

    <a-modal
      v-model="phoneModal"
      title="修改手机号码"
      ok-text="确定"
      cancel-text="取消"
      @ok="submitPhone"
    >
      <p>手机号码：</p>
      <p>
        <a-input v-model="modifyPhone" placeholder="请输入手机号码"></a-input>
      </p>
    </a-modal>

    <a-modal
      v-model="pwModal"
      title="修改登录密码"
      ok-text="确定"
      cancel-text="取消"
      @ok="submitPw"
    >
      <p>新密码：</p>
      <p>
        <a-input-password
          v-model="modifyPw"
          placeholder="请输入新密码"
        ></a-input-password>
      </p>
      <p>确认新密码：</p>
      <p>
        <a-input-password
          v-model="confirmPw"
          placeholder="请再次输入新密码"
        ></a-input-password>
      </p>
    </a-modal>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { phoneCheck } from "@/assets/js/utils";

const userInfoData = [
  {
    icon: "idcard",
    name: "工\u3000\u3000号",
    modify: false,
  },
  {
    icon: "user",
    name: "姓\u3000\u3000名",
    modify: false,
  },
  {
    icon: "phone",
    name: "手机号码",
    modify: true,
    key: "phoneModal",
  },
  {
    icon: "apartment",
    name: "部门归属",
    modify: false,
  },
  {
    icon: "lock",
    name: "登陆密码",
    modify: true,
    key: "pwModal",
  },
];

export default {
  name: "User",
  computed: {
    ...mapState(["userDetail", "modulesData", "projectData"]),
    userInfoData() {
      const { userDetail } = this;
      const { userType } = userDetail;
      if (userType == 0) {
        return userInfoData;
      } else {
        const newData = [...userInfoData];
        newData[0].name = "公\u3000\u3000司";
        return newData;
      }
    },
    modulesColumns() {
      return [
        {
          title: "功能模块",
          dataIndex: "modelName",
          key: "modelName",
          align: "center",
          customHeaderCell: this.renderTableHeader,
        },
        {
          title: "浏览",
          dataIndex: "browseRoot",
          key: "browseRoot",
          align: "center",
          customRender: (text, record, index) => {
            return <a-checkbox checked={text}></a-checkbox>;
          },
          customHeaderCell: this.renderTableHeader,
        },
      ];
    },
    projectColumns() {
      return [
        {
          title: "一级部门",
          dataIndex: "parentDeptName",
          key: "parentDeptName",
          align: "center",
          customHeaderCell: this.renderTableHeader,
        },
        {
          title: "二级部门",
          dataIndex: "deptName",
          key: "deptName",
          align: "center",
          customHeaderCell: this.renderTableHeader,
        },
        {
          title: "浏览",
          dataIndex: "browseRoot",
          key: "browseRoot",
          align: "center",
          customRender: (text, record, index) => {
            return <a-checkbox checked={text}></a-checkbox>;
          },
          customHeaderCell: this.renderTableHeader,
        },
        {
          title: "下载",
          dataIndex: "downloadRoot",
          key: "downloadRoot",
          align: "center",
          customRender: (text, record, index) => {
            return <a-checkbox checked={text}></a-checkbox>;
          },
          customHeaderCell: this.renderTableHeader,
        },
      ];
    },
    userDetailData() {
      const { userDetail } = this;
      if (userDetail) {
        const {
          jobId,
          agentName,
          userName,
          phone,
          department,
          passwordLength,
        } = userDetail;

        const deptString = department
          ? `${department.parentDeptName || ""}-${department.deptName || ""}`
          : "";

        return [
          jobId || agentName,
          userName,
          phone,
          deptString,
          new Array(passwordLength).join("*"),
        ];
      } else {
        return [];
      }
    },
  },
  data() {
    return {
      phoneModal: false,
      pwModal: false,
      modifyPhone: null,
      modifyPw: null,
      confirmPw: null,
    };
  },
  methods: {
    ...mapActions([
      "getUserInfo",
      "getProjectRight",
      "getModulesRight",
      "updatePassword",
      "updateUserPhone",
    ]),
    openModify(key) {
      this[key] = true;
    },
    submitPw() {
      const { modifyPw, confirmPw } = this;
      if (!modifyPw || !confirmPw) {
        this.$message.error("密码不能为空");
        return false;
      }
      if (modifyPw !== confirmPw) {
        this.$message.error("两次输入密码不一致");
        return false;
      }

      this.updatePassword({ password: confirmPw });
      this.pwModal = false;
    },
    submitPhone() {
      const { modifyPhone } = this;
      if (!modifyPhone) {
        this.$message.error("手机号码不能为空");
        return false;
      }
      if (!phoneCheck(modifyPhone)) {
        this.$message.error("手机号码不符合规则");
        return false;
      }
      this.updateUserPhone({ phone: modifyPhone });
      this.phoneModal = false;
    },
    renderTableHeader() {
      return {
        style: {
          background: "#E8F3FA",
        },
      };
    },
    rowClassName(record, index) {
      if (index % 2 === 1) return "dark";
    },
  },
  mounted() {
    this.getUserInfo();
    this.getProjectRight();
    this.getModulesRight();
  },
};
</script>

<style lang="less" scoped>
.userInfo-ctn {
  margin-bottom: 20px;
  background: #fff;
  .userInfo-row {
    display: flex;
    height: 54px;
    line-height: 54px;
    .userInfo-icon {
      border-bottom: 1px solid #ffffff;
      width: 54px;
      background-color: #e8f3fa;
      color: #0073c6;
      font-size: 16px;
      text-align: center;
    }
    .userInfo-detail {
      display: flex;
      border-bottom: 1px solid #eff1f2;
      width: 100%;
      padding-left: 16px;

      & > p {
        margin: 0 0 0 10px;

        .modify-btn {
          color: #0073c6;
          font-size: 12px;
          cursor: pointer;
          transition: 0.2s all linear;
          &:hover {
            opacity: 0.7;
          }
        }
      }
    }
  }
}

.authority-ctn {
  display: flex;

  & > div {
    padding: 20px;
    background-color: #fff;
    /deep/ .ant-table-body {
      border: 1px solid #d9d9d9;
      border-bottom: 0;
    }
    /deep/ .dark {
      background-color: #f7f7f7;
    }
  }

  .title {
    margin: 0 auto 20px;
    font-size: 16px;
    color: #1d1a1a;
  }

  .left-ctn {
    flex-shrink: 0;
    margin-right: 20px;
    width: 360px;
  }

  .right-ctn {
    width: 100%;
  }
}
</style>