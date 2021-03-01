import React, { Component } from 'react';
import { View, Image } from '@tarojs/components';
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
  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  handleClick = (value) => {
    this.setState({
      current: value,
    });
  };
  render() {
    const tabList = [{ title: '猜对电影榜' }, { title: '查看电影榜' }];

    const boardList = [{}, {}, {}, {}, {}, {}, {}];

    return (
      <View className='leaderboard'>
        <AtTabs
          current={this.state.current}
          tabList={tabList}
          onClick={this.handleClick.bind(this)}
        >
          <AtTabsPane current={this.state.current} index={0}>
            <View className='content-wrap'>
              {boardList.map((item, index) => {
                return (
                  <View
                    key={index}
                    className='item at-row at-row__justify--between at-row__align--center'
                  >
                    <View className='number'>{index + 1}</View>
                    <Image
                      className='avatar'
                      src='https://p2-static.oss-cn-beijing.aliyuncs.com/MiniApp/pmccc/images/user_default.png'
                    />
                    <View className='username at-col'>不管三七二十一</View>
                    <View className='right'>猜对322部</View>
                  </View>
                );
              })}
            </View>
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={1}>
            <View className='content-wrap'>
              {boardList.map((item, index) => {
                return (
                  <View
                    key={index}
                    className='item at-row at-row__justify--between at-row__align--center'
                  >
                    <View className='number'>{index + 1}</View>
                    <Image
                      className='avatar'
                      src='https://p2-static.oss-cn-beijing.aliyuncs.com/MiniApp/pmccc/images/user_default.png'
                    />
                    <View className='username at-col'>不管三七二十一</View>
                    <View className='right'>猜对322部</View>
                  </View>
                );
              })}
            </View>
          </AtTabsPane>
        </AtTabs>
      </View>
    );
  }
}

export default Index;
