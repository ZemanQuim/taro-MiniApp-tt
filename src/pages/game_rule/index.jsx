import React, { Component } from 'react';
import { View } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
import './index.scss';

@inject('store')
@observer
class Index extends Component {
  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return (
      <View className='game-rule '>
        <View className='rule_h2'>猜电影片名规则</View>
        <View className='info'>
          <View>猜对电影奖励5积分</View>
          <View>猜错电影名扣10积分</View>
          <View>查看电影名扣100积分</View>
          <View>查看电影名和猜对电影记录都会在个人中心里查看</View>
        </View>
        <View className='rule_h2'>积分用途</View>
        <View className='info'>
          <View>积分用于猜电影片名和查看电影名称</View>
          <View>初始积分100分</View>
          <View>每日签到奖励100积分，连续签到越多奖励越多</View>
        </View>
        <View className='rule_h2'>签到规则</View>
        <View className='info'>
          <View>每天签到奖励100积分</View>
          <View>连续签到中断签到，从头开始计</View>
        </View>
      </View>
    );
  }
}

export default Index;
