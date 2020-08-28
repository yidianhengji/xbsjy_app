import { POWER_TYPE } from "@/util/constListCode";
import { resProjectauthorityQueryProAuthOfUser } from "@/api/ddc";
import { IS_OK } from "@/api/path";
export const mixinProject = {
  data () {
    return {
      checkDataList: [
        {
          dictionarydataValue: POWER_TYPE.READ.key,
          dictionarydataName: POWER_TYPE.READ.value
        },
        {
          dictionarydataValue: POWER_TYPE.WRITE.key,
          dictionarydataName: POWER_TYPE.WRITE.value
        },
        {
          dictionarydataValue: POWER_TYPE.DELETE.key,
          dictionarydataName: POWER_TYPE.DELETE.value
        },
        {
          dictionarydataValue: POWER_TYPE.FILE_READ.key,
          dictionarydataName: POWER_TYPE.FILE_READ.value
        },
        {
          dictionarydataValue: POWER_TYPE.FILE_WRITE.key,
          dictionarydataName: POWER_TYPE.FILE_WRITE.value
        },
        {
          dictionarydataValue: POWER_TYPE.RELEASE.key,
          dictionarydataName: POWER_TYPE.RELEASE.value
        },
        {
          dictionarydataValue: POWER_TYPE.UNLOCK.key,
          dictionarydataName: POWER_TYPE.UNLOCK.value
        },
        {
          dictionarydataValue: POWER_TYPE.SETTING_PERMISSIONS.key,
          dictionarydataName: POWER_TYPE.SETTING_PERMISSIONS.value
        },
        {
          dictionarydataValue: POWER_TYPE.CREATESUBDIRECTORIES.key,
          dictionarydataName: POWER_TYPE.CREATESUBDIRECTORIES.value
        },
        {
          dictionarydataValue: POWER_TYPE.CREATEDOCUMENT.key,
          dictionarydataName: POWER_TYPE.CREATEDOCUMENT.value
        }
      ]
    }
  },
  methods: {
    async authorityVerification (uid, type) {
      let checkedFalg = false;
      let param = {
        projectId: uid,
        userId: localStorage.getItem("userId")
      };
      const res = await resProjectauthorityQueryProAuthOfUser(param);
      if (res.data.code === IS_OK) {
        let data = res.data.data;
        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            if (data[i] === "-1") {
              checkedFalg = false;
              break;
            }
            if (data[i] === type) {
              checkedFalg = true;
              break;
            }
          }
        } else {
          checkedFalg = false;
        }
      }
      if (!checkedFalg) {
        this.$message({
          message: "无操作权限，请联系项目管理人员。",
          type: "warning"
        });
      }
      return checkedFalg;
    },
    // 修改操作权限
    beforeUpdateBtn (uid) {
      return this.authorityVerification(uid, POWER_TYPE.WRITE.key);
    },
    // 删除操作权限
    beforeDeleteBtn (uid) {
      return this.authorityVerification(uid, POWER_TYPE.DELETE.key);
    },
    // 查看操作权限
    beforeViewBtn (uid) {
      return this.authorityVerification(uid, POWER_TYPE.READ.key);
    },
  },
}