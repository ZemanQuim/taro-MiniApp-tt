import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { observer, inject } from 'mobx-react';

import { AtTabs, AtTabsPane } from 'taro-ui';
import './index.scss';

@inject('store')
@observer
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      current: 0,
    };
  }

  componentWillMount() {
    const { counterStore } = this.props.store;
    counterStore.signInRankingList({ type: 1 });
  }

  componentDidMount() {
    setTimeout(() => {
      this._ruleClick();
    }, 500);
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  //切换tab
  _handleClick = (value) => {
    this.setState({
      current: value,
    });
    const { counterStore } = this.props.store;
    counterStore.signInRankingList({ type: value + 1 });
  };

  //规则
  _ruleClick = () => {
    Taro.showModal({
      title: '签到奖励规则',
      content:
        '每天签到奖励100积分\n连续签到30天再送10元话费\n连续签到180天再送50元话费\n话费领取:在个人中心联系客服\n连续签到中间断签，从头开始计\n签到有广告，看完广告才有奖励',
      confirmColor: '#FD2C57',
      success: (res) => {
        if (res.confirm) {
          this._signClick();
        }
      },
    });
  };

  //签到
  _signClick = () => {
    const { counterStore } = this.props.store;
    const { isSignToday } = counterStore;
    if (isSignToday) {
      Taro.showToast({
        title: '已签到,明天签到奖励更多',
        icon: 'none',
        duration: 2000,
      });
      return false;
    }

    //创建广告
    const videoAd = Taro.createRewardedVideoAd({
      adUnitId: '1cc8wlr6hjyl99n6i8',
    });
    // 广告创建后默认是隐藏的，可以通过该方法显示广告
    videoAd.show();
    //捕捉错误
    videoAd.onError((err) => {
      // 进行适当的提示
      Taro.showToast({ title: '加载错误', icon: 'fail' });
    });
    // 监听关闭
    videoAd.onClose(async (status) => {
      if ((status && status.isEnded) || status === undefined) {
        // 正常播放结束，下发奖励
        await counterStore.signIn();
        counterStore.signInRankingList({ type: 1 });
      } else {
        // 播放中途退出，进行提示
        Taro.showToast({ title: '签到失败', icon: 'fail' });
      }
    });
  };

  render() {
    const tabList = [{ title: '今日签到' }, { title: '连续签到' }];
    const {
      counterStore: {
        isSignToday,
        signInSuccess,
        signInDay,
        signInPoint,
        todaySignin,
        continuousSignin,
      },
    } = this.props.store;
    return (
      <View className='signin'>
        {signInSuccess ? (
          <View className='signin-btn' onClick={this._signClick.bind(this)}>
            签到成功!连续签到{signInDay}天,奖励{signInPoint}
          </View>
        ) : (
          <View className='signin-btn' onClick={this._signClick.bind(this)}>
            {isSignToday == 0 ? '点击签到领积分' : '你今天已经签到了!'}
          </View>
        )}
        <Text className='rule' onClick={this._ruleClick.bind(this)}>
          签到奖励规则
        </Text>

        <View className='signin-wrap'>
          <AtTabs
            current={this.state.current}
            tabList={tabList}
            onClick={this._handleClick.bind(this)}
          >
            <AtTabsPane current={this.state.current} index={0}>
              <View className='content-wrap'>
                {todaySignin.map(
                  ({ nickname, avatar, created_at, day, point }, index) => {
                    return (
                      <View
                        key={index}
                        className='item at-row at-row__justify--between at-row__align--center'
                      >
                        <Image className='avatar' src={avatar} />
                        <View className='user at-col'>
                          <View className='user-name'>{nickname}</View>
                          <View className='signin-time'>{created_at}</View>
                        </View>
                        <View className='reward'>
                          <View className='days'>连续签到{day}天</View>
                          <View className='coin'>奖励{point}积分</View>
                        </View>
                      </View>
                    );
                  }
                )}
              </View>
            </AtTabsPane>
            <AtTabsPane current={this.state.current} index={1}>
              <View className='content-wrap'>
                {continuousSignin.map(
                  ({ nickname, avatar, created_at, day, point }, index) => {
                    return (
                      <View
                        key={index}
                        className='item at-row at-row__justify--between at-row__align--center'
                      >
                        <Image className='avatar' src={avatar} />
                        <View className='user at-col'>
                          <View className='user-name'>{nickname}</View>
                          <View className='signin-time'>{created_at}</View>
                        </View>
                        <View className='reward'>
                          <View className='days'>连续签到{day}天</View>
                          <View className='coin'>奖励{point}积分</View>
                        </View>
                      </View>
                    );
                  }
                )}
              </View>
            </AtTabsPane>
          </AtTabs>
        </View>
      </View>
    );
  }
}

export default Index;
