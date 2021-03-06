import Taro from '@tarojs/taro';
import { observable, action, runInAction } from 'mobx';
import { login, getUserInfo, bindInfo } from '../servers/servers';

class authStore {
  @observable userinfo = {};
  @observable isLogin = false;
  // @observable openid = '';
  @observable point = 0;
  @observable right_num = 0;
  @observable see_num = 0;

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

  //获取用户信息
  @action getUserInfo = () => {
    // 用户同意授权用户信息
    Taro.getUserInfo({
      success: (resp) => {
        runInAction(() => {
          this.userinfo = resp.userInfo;
        });
        //绑定用户信息到后台
        bindInfo({
          avatar: resp.userInfo.avatarUrl,
          nickname: resp.userInfo.nickName,
        });
        //获取后台用户数据
        this.getInfo();
      },
    });
  };

  //登录后台
  @action login = async (postData) => {
    try {
      const res = await login(postData);
      if (res.code == 200) {
        runInAction(() => {
          Taro.setStorage({ key: 'OPENID', data: res.data.openid });
          Taro.setStorage({ key: 'SESSION_KEY', data: res.data.session_key });
          // this.openid = res.data.openid;
          this.isLogin = true;
        });
        Taro.showToast({ title: '登录成功' });
      } else {
        Taro.showToast({ title: res.message, icon: 'fail' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  //查询用户数据
  @action getInfo = async () => {
    Taro.showLoading({ title: '加载中' });
    try {
      const { code, data } = await getUserInfo();
      runInAction(() => {
        if (code == 200 && data) {
          this.isLogin = true;
          this.point = data.point;
          this.right_num = data.right_num;
          this.see_num = data.see_num || 0;
        }
      });
      Taro.hideLoading();
    } catch (err) {
      console.error(err);
      Taro.hideLoading();
    }
  };

  @action changeState = (state) => {
    Object.assign(this, state);
  };
}

export default new authStore();
