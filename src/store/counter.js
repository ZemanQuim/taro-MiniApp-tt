import Taro from '@tarojs/taro';
import { observable, action, runInAction } from 'mobx';
import {
  getRankingList,
  getMyWatchList,
  getGuessList,
  getOneMovie,
  anwser,
  watchAnwser,
  getPointRecord,
  signIn,
  signInRankingList,
} from '../servers/servers';

class counterStore {
  @observable guessRankingList = []; //猜对排行榜
  @observable seeRankingList = []; //查看排行榜
  @observable myWatchList = []; //我查看的
  @observable myGuessList = []; //我猜对的
  @observable oneMovie = {}; //当前视频信息
  @observable point = 0; //当前积分余额
  @observable words = []; //可选文字
  @observable exactAnwser = ''; //准确答案
  @observable isWatch = false; //是否查看答案
  @observable pointRecord = []; //积分明细
  @observable isSignToday = 0; //今日是否签到 1-已经签到 0-未签到
  @observable signInSuccess = false; //签到成功?
  @observable signInDay = 1; //连续签到天数
  @observable signInPoint = 100; //签到奖励
  @observable todaySignin = []; //今日签到列表
  @observable continuousSignin = []; //连续签到列表

  //排行榜
  @action getRankingList = async (params) => {
    try {
      const res = await getRankingList(params);
      runInAction(() => {
        if (params.type == 1) {
          this.guessRankingList = res.data.list.data;
        } else {
          this.seeRankingList = res.data.list.data;
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  //我看过的电影
  @action getMyWatchList = async (params) => {
    try {
      const res = await getMyWatchList(params);
      runInAction(() => {
        this.myWatchList = res.data.list.data;
      });
    } catch (err) {
      console.log(err);
    }
  };

  //我猜对的电影
  @action getGuessList = async (params) => {
    try {
      const res = await getGuessList(params);
      runInAction(() => {
        this.myGuessList = res.data.list.data;
      });
    } catch (err) {
      console.log(err);
    }
  };

  //积分记录
  @action getPointRecord = async (params) => {
    try {
      const res = await getPointRecord(params);
      runInAction(() => {
        this.pointRecord = res.data.list.data;
      });
    } catch (err) {
      console.log(err);
    }
  };

  //猜一部电影
  @action getOneMovie = async () => {
    Taro.showLoading({
      title: '加载中',
    });
    try {
      const res = await getOneMovie();
      Taro.hideLoading();
      runInAction(() => {
        this.oneMovie = res.data.movie;
        this.point = res.data.point;
        this.words = res.data.words;
        this.isWatch = false;
      });
    } catch (error) {}
  };

  //猜电影
  @action anwser = async (postData) => {
    try {
      const { data } = await anwser(postData);
      data.state == 1
        ? Taro.showToast({ title: '答对加5分', duration: 2000 })
        : Taro.showToast({
            title: '答错扣10分',
            icon: 'fail',
          });
      runInAction(() => {
        this.point = data.point;
      });
    } catch (error) {}
  };

  //查看电影名
  @action watchAnwser = async (postData) => {
    try {
      const res = await watchAnwser(postData);
      if (res.code == 200) {
        runInAction(() => {
          this.exactAnwser = res.data.movie.title;
          this.point = res.data.point;
          this.isWatch = true;
        });
        Taro.showToast({ title: '查看成功', duration: 1500 });
      } else {
        runInAction(() => {
          this.isWatch = false;
        });
        // Taro.showToast({ title: '积分不足', icon: 'fail' });
      }
    } catch (error) {}
  };

  //签到
  @action signIn = async () => {
    Taro.showLoading({
      title: '加载中',
    });
    try {
      const res = await signIn();
      Taro.hideLoading();
      if (res.code == 200) {
        Taro.showToast({
          title: '签到成功',
          icon: 'success',
          duration: 2000,
        });
        runInAction(() => {
          this.isSignToday = 1;
          this.signInSuccess = true;
          this.signInDay = res.data.day;
          this.signInPoint = res.data.point;
        });
      } else {
        runInAction(() => {
          this.signInSuccess = false;
        });
      }
    } catch (error) {
      Taro.hideLoading();
      Taro.showToast({
        title: '签到失败',
        icon: 'fail',
        duration: 2000,
      });
    }
  };

  //签到排行榜
  @action signInRankingList = async (getData) => {
    try {
      const { data } = await signInRankingList(getData);
      // Taro.setStorage({ key: 'isSignToday', data: data.isSignToday });
      runInAction(() => {
        this.isSignToday = data.isSignToday;
        if (getData.type == 1) {
          this.todaySignin = data.list;
        } else {
          this.continuousSignin = data.list;
        }
      });
    } catch (error) {}
  };

  //
  @action changeState = (state) => {
    Object.assign(this, state);
  };
}

export default new counterStore();
