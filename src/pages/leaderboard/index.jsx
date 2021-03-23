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

  componentDidMount() {
    const { counterStore } = this.props.store;
    counterStore.getRankingList({ type: 1 });
    counterStore.getRankingList({ type: 2 });
  }

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
    const { counterStore } = this.props.store;
    const { guessRankingList, seeRankingList } = counterStore;
    // const boardList = [{}, {}, {}, {}, {}, {}, {}];

    return (
      <View className='leaderboard'>
        <View className='header'></View>
        <View className='content'>
          <AtTabs
            current={this.state.current}
            tabList={tabList}
            onClick={this.handleClick.bind(this)}
          >
            <AtTabsPane current={this.state.current} index={0}>
              <View className='content-wrap'>
                {guessRankingList.map((item, index) => {
                  return (
                    <View
                      key={index}
                      className='item at-row at-row__justify--between at-row__align--center'
                    >
                      <View className='number'>{index + 1}</View>
                      <Image className='avatar' src={item?.user.avatar} />
                      <View className='username'>{item?.user.nickname}</View>
                      <View className='right'>猜对{item?.num}部</View>
                    </View>
                  );
                })}
              </View>
            </AtTabsPane>
            <AtTabsPane current={this.state.current} index={1}>
              <View className='content-wrap'>
                {seeRankingList.map((item, index) => {
                  return (
                    <View
                      key={index}
                      className='item at-row at-row__justify--between at-row__align--center'
                    >
                      <View className='number'>{index + 1}</View>
                      <Image className='avatar' src={item?.user.avatar} />
                      <View className='username'>{item?.user.nickname}</View>
                      <View className='right'>查看{item?.num}部</View>
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
