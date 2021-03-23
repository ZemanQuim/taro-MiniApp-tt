import React, { Component } from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
import Taro from '@tarojs/taro';
// import { AtIcon } from 'taro-ui';
import { AtList, AtListItem } from 'taro-ui';
import './index.scss';

@inject('store')
@observer
class Index extends Component {
  componentWillMount() {
    const { authStore, counterStore } = this.props.store;
    authStore.getUserInfo();
    counterStore.getPointRecord();
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

  _loginOut = () => {
    const { authStore } = this.props.store;
    authStore.changeState({ isLogin: false });
    Taro.removeStorage({
      key: 'Authorization',
    });
    Taro.navigateBack({
      success: (res) => {
        console.log(res);
        Taro.showToast({ title: '退出成功' });
      },
    });
  };

  render() {
    const {
      authStore: { userinfo, point },
      counterStore: { pointRecord },
    } = this.props.store;
    return (
      <View className='personal'>
        <View className='user-info '>
          <Image
            className='avatar'
            src={
              userinfo.avatarUrl
                ? userinfo.avatarUrl
                : 'https://p2-static.oss-cn-beijing.aliyuncs.com/MiniApp/pmccc/images/user_default.png'
            }
          />
          <View className='info '>
            <View className='username'>
              {userinfo.nickName ? userinfo.nickName : '未登录'}
            </View>
            <View className='coin'>积分:{point}</View>
          </View>
          <Button className='loginout ' onClick={this._loginOut.bind(this)}>
            退出登录
          </Button>
        </View>

        <View className='help_list'>
          <View className='watched' onClick={this._watchedHandle.bind(this)}>
            <Image
              className='icon'
              src='https://p2-static.oss-cn-beijing.aliyuncs.com/MiniApp/pmccc/images/watched.png'
            />
            <View className='text'>我查看的电影</View>
          </View>
          <View className='guessed' onClick={this._guessedHandle.bind(this)}>
            <Image
              className='icon'
              src='https://p2-static.oss-cn-beijing.aliyuncs.com/MiniApp/pmccc/images/guessed.png'
            />
            <View className='text'>我猜对的电影</View>
          </View>
          <View className='service'>
            <Button className='contact-button' openType='contact'></Button>
            <Image
              className='icon'
              src='https://p2-static.oss-cn-beijing.aliyuncs.com/MiniApp/pmccc/images/service.png'
            />
            <View className='text'>联系在线客服</View>
          </View>
        </View>

        <View className='coin-list'>
          <View className='list-title at-row at-row__justify--around at-row__align--center'>
            <View className='title-coin'>积分记录</View>
            <View className='title-price'>金额</View>
            <View className='title-time'>时间</View>
          </View>
          <View className='list-content'>
            {pointRecord.map((item, index) => {
              return (
                <View
                  key={index}
                  className='list-detail at-row at-row__justify--around at-row__align--center'
                >
                  <View className='coin_in at-col'>{item?.title}</View>
                  <View className='coin_num at-col'>{item?.point}</View>
                  <View className='coin_time at-col'>{item?.created_at}</View>
                </View>
              );
            })}
            {pointRecord.length == 0 ? (
              <Image
                className='null'
                src='https://p2-static.oss-cn-beijing.aliyuncs.com/MiniApp/pmccc/images/null.png'
              />
            ) : null}
          </View>
        </View>
      </View>
    );
  }
}

export default Index;
