import Taro from '@tarojs/taro';
import { observable, action, runInAction } from 'mobx';

class homeStore {
  @observable userinfo = {};
  @observable loading = false;

  @action getSetting = () => {
    // 可以通过 Taro.getSetting 先查询一下用户是否授权了 "scope.userInfo" 这个 scope
    Taro.getSetting({
      success: (res) => {
        console.log(res.authSetting);
        if (!res.authSetting['scope.userInfo']) {
          Taro.authorize({
            scope: 'scope.userInfo',
            success: () => {
              this.getUserInfo();
            },
            fail: (resp) => {
              console.log('授权失败！', resp);
              this.openSetting();
            },
          });
        } else {
          this.getUserInfo();
          // console.log('scope登录失败！', res.errMsg);
        }
      },
    });
  };

  //打开设置页面
  openSetting = () => {
    Taro.openSetting({
      success: function (res) {
        console.log(res.authSetting);
        // res.authSetting = {
        //   "scope.userInfo": true,
        //   "scope.userLocation": true
        // }
      },
    });
  };

  @action getUserInfo = () => {
    // 用户同意授权用户信息
    Taro.getUserInfo({
      success: (resp) => {
        console.log('userinfo---------->', resp);
        runInAction(() => {
          this.userinfo = resp.userInfo;
        });
        // var userInfo = res.userInfo
        // var nickName = userInfo.nickName
        // var avatarUrl = userInfo.avatarUrl
        // var gender = userInfo.gender //性别 0：未知、1：男、2：女
        // var province = userInfo.province
        // var city = userInfo.city
        // var country = userInfo.country
      },
    });
  };
}

export default new homeStore();
