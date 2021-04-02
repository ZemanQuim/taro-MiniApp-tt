import Taro from '@tarojs/taro';
import { observable, action, runInAction } from 'mobx';
import { getGoalMovie, getGoalRecord } from '../servers/servers';

class goalStore {
  @observable record = [];
  @observable oneMovie = {};
  @observable words = [];
  @observable options = [];

  //猜一部电影
  @action getGoalMovie = async (params) => {
    Taro.showLoading({
      title: '加载中',
    });
    try {
      const res = await getGoalMovie(params);
      Taro.hideLoading();
      runInAction(() => {
        this.oneMovie = res.data.movie;
        this.words = res.data.words;
        this.options = res.data.name_option;
      });
    } catch (error) {}
  };

  //弹幕
  @action getGoalRecord = async (params) => {
    try {
      const res = await getGoalRecord(params);
      runInAction(() => {
        this.record = res.data.list;
      });
    } catch (error) {}
  };

  @action changeState = (state) => {
    Object.assign(this, state);
  };
}

export default new goalStore();
