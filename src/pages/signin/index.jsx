import React, { Component } from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import { observer, inject } from 'mobx-react';

import {
  AtTabs,
  AtTabsPane,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
} from 'taro-ui';
import './index.scss';

@inject('store')
@observer
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      current: 0,
      isOpened: false,
      signIsOpened: false,
    };
  }

  componentWillMount() {}

  componentDidMount() {
    // const { homeStore } = this.props.store;
    // homeStore.getJokeData();
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  _handleClick = (value) => {
    this.setState({
      current: value,
    });
  };
  _ruleClick = () => {
    this.setState({
      isOpened: true,
    });
  };
  _signClick = () => {
    this.setState({
      signIsOpened: true,
    });
  };
  _handleClose = () => {
    this.setState({
      isOpened: false,
    });
  };
  _signinClose = () => {
    this.setState({
      signIsOpened: false,
    });
  };

  render() {
    const tabList = [{ title: '今日签到' }, { title: '连续签到' }];
    const signinList = [{}, {}, {}, {}, {}, {}, {}];
    const { isOpened, signIsOpened } = this.state;
    // const {
    //   homeStore: { rainbow },
    // } = this.props.store;
    return (
      <View className='signin'>
        <View className='signin-btn' onClick={this._signClick.bind(this)}>
          点击签到领积分
        </View>
        <Text className='rule' onClick={this._ruleClick.bind(this)}>
          签到奖励规则
        </Text>
        {/* <AtModal
          isOpened={isOpened}
          cancelText='取消'
          confirmText='确认'
          onClose={this._handleClose.bind(this)}
          onCancel={this._handleClose.bind(this)}
          onConfirm={this._handleClose.bind(this)}
          content='每天签到奖励100积分\n
          连续签到30天再送10元话费\n
          连续签到180天再送50元话费\n
          话费领取:在个人中心联系客服\n
          连续签到中间断签，从头开始计\n
          签到有广告，看完广告才有奖励'
        /> */}
        <AtModal isOpened={isOpened}>
          <AtModalHeader>签到奖励规则</AtModalHeader>
          <AtModalContent>
            <View className='rule-content'>
              <View>每天签到奖励100积分</View>
              <View>连续签到30天再送10元话费</View>
              <View>连续签到180天再送50元话费</View>
              <View>话费领取:在个人中心联系客服</View>
              <View>连续签到中间断签，从头开始计</View>
              <View>签到有广告，看完广告才有奖励</View>
            </View>
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this._handleClose.bind(this)}>取消</Button>
            <Button onClick={this._handleClose.bind(this)}>确定</Button>
          </AtModalAction>
        </AtModal>
        <AtModal isOpened={signIsOpened}>
          <AtModalHeader>签到领积分</AtModalHeader>
          <AtModalContent>
            <View className='rule-content'>
              <View>签到有广告,看完广告才有积分奖励</View>
              <View>点击确定完成签到</View>
            </View>
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this._signinClose.bind(this)}>取消</Button>
            <Button onClick={this._signinClose.bind(this)}>确定</Button>
          </AtModalAction>
        </AtModal>
        <View className='signin-wrap'>
          <AtTabs
            current={this.state.current}
            tabList={tabList}
            onClick={this._handleClick.bind(this)}
          >
            <AtTabsPane current={this.state.current} index={0}>
              <View className='content-wrap'>
                {signinList.map((item, index) => {
                  return (
                    <View
                      key={index}
                      className='item at-row at-row__justify--between at-row__align--center'
                    >
                      <Image
                        className='avatar'
                        src='https://p2-static.oss-cn-beijing.aliyuncs.com/MiniApp/pmccc/images/user_default.png'
                      />
                      <View className='user at-col'>
                        <View className='user-name'>Cola爱追剧</View>
                        <View className='signin-time'>今天 15:42</View>
                      </View>
                      <View className='reward'>
                        <View className='days'>连续签到1天</View>
                        <View className='coin'>奖励100积分</View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </AtTabsPane>
            <AtTabsPane current={this.state.current} index={1}>
              <View className='content-wrap'>
                {signinList.map((item, index) => {
                  return (
                    <View
                      key={index}
                      className='item at-row at-row__justify--between at-row__align--center'
                    >
                      <Image
                        className='avatar'
                        src='https://p2-static.oss-cn-beijing.aliyuncs.com/MiniApp/pmccc/images/user_default.png'
                      />
                      <View className='user at-col'>
                        <View className='user-name'>Cola爱追剧</View>
                        <View className='signin-time'>今天 15:42</View>
                      </View>
                      <View className='reward'>
                        <View className='days'>连续签到1天</View>
                        <View className='coin'>奖励100积分</View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </AtTabsPane>
          </AtTabs>
        </View>
      </View>
    );
  }
}

export default Index;
