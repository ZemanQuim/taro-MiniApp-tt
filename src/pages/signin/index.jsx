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
    counterStore.signInRankingList({ type: this.state.current + 1 });
  }

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  //切换tab
  _handleClick = (value) => {
    this.setState({
      current: value,
    });
  };

  //规则
  _ruleClick = () => {
    Taro.showModal({
      title: '签到奖励规则',
      content:
        '每天签到奖励100积分\n连续签到30天再送10元话费\n连续签到180天再送50元话费\n话费领取:在个人中心联系客服\n连续签到中间断签，从头开始计\n签到有广告，看完广告才有奖励',
      confirmColor: '#FD2C57',
    });
  };

  //签到
  _signClick = () => {
    const { counterStore } = this.props.store;
    Taro.showModal({
      title: '签到领积分',
      content: '签到有广告,看完广告才有积分奖励\n点击确定完成签到',
      confirmColor: '#FD2C57',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          counterStore.signIn();
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      },
    });
  };

  render() {
    const tabList = [{ title: '今日签到' }, { title: '连续签到' }];
    const {
      counterStore: { isSignToday, todaySignin, continuousSignin },
    } = this.props.store;
    return (
      <View className='signin'>
        <View className='signin-btn' onClick={this._signClick.bind(this)}>
          {isSignToday == 0 ? '点击签到领积分' : '你今天已经签到了!'}
        </View>
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
