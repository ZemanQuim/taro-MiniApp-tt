import React, { Component } from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
import Taro from '@tarojs/taro';
import { AtIcon } from 'taro-ui';
import './index.scss';

@inject('store')
@observer
class Index extends Component {
  componentWillMount() {
    const { authStore } = this.props.store;
    authStore.getUserInfo();
  }

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  _watchedHandle = () => {
    Taro.navigateTo({
      url: '../watched_movie/index',
    });
  };
  _guessedHandle = () => {
    Taro.navigateTo({
      url: '../guessed_movie/index',
    });
  };

  render() {
    const {
      authStore: { userinfo },
    } = this.props.store;
    return (
      <View className='personal'>
        <View className='user-info at-row at-row__align--center'>
          <Image
            className='avatar'
            src={
              userinfo.avatarUrl
                ? userinfo.avatarUrl
                : 'https://p2-static.oss-cn-beijing.aliyuncs.com/MiniApp/pmccc/images/user_default.png'
            }
          />
          <View className='info at-col'>
            <View className='username'>
              {userinfo.nickName ? userinfo.nickName : '游客'}
            </View>
            <View className='coin'>积分:120</View>
          </View>
          <Button
            className='loginout at-col at-col__offset-2'
            openType='getUserInfo'
          >
            退出登录
          </Button>
        </View>
        <View className='movie'>
          <View
            className='watched at-row at-row__justify--between at-row__align--center'
            onClick={this._watchedHandle.bind(this)}
          >
            <Text>我查看的电影</Text>
            <AtIcon value='heart' size='30' color='#fff'></AtIcon>
          </View>
          <View
            className='guessed at-row at-row__justify--between at-row__align--center'
            onClick={this._guessedHandle.bind(this)}
          >
            <Text>我猜对的电影</Text>
            <AtIcon value='list' size='30' color='#fff'></AtIcon>
          </View>
          <View className='customer at-row at-row__justify--between at-row__align--center'>
            <Text>联系在线客服</Text>
            <AtIcon value='message' size='30' color='#fff'></AtIcon>
          </View>
        </View>
        <View className='coin-list'>
          <View className='list-title at-row at-row__justify--around at-row__align--center'>
            <View className='title-coin'>积分记录</View>
            <View className='title-price'>金额</View>
            <View className='title-time'>时间</View>
          </View>
          <View className='list-content'>
            <View className='list-detail at-row at-row__justify--around at-row__align--center'>
              <View className='coin_in at-col'>每日签到</View>
              <View className='coin_num at-col'>+100积分</View>
              <View className='coin_time at-col'>2021-02-25 00:00:00</View>
            </View>
            <View className='list-detail at-row at-row__justify--around at-row__align--center'>
              <View className='coin_in at-col'>电影猜错扣除</View>
              <View className='coin_num at-col'>-10积分</View>
              <View className='coin_time at-col'>2021-02-25 00:00:00</View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default Index;
