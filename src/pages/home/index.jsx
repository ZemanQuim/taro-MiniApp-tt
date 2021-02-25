import React, { Component } from 'react';
import { View } from '@tarojs/components';
import { observer, inject } from 'mobx-react';

import { AtButton } from 'taro-ui';
import './index.scss';

@inject('store')
@observer
class Index extends Component {
  componentWillMount() {}

  componentDidMount() {
    const { homeStore } = this.props.store;
    homeStore.getJokeData();
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  getNew = () => {
    const { homeStore } = this.props.store;
    homeStore.getJokeData();
  };

  render() {
    const {
      homeStore: { rainbow },
    } = this.props.store;
    return (
      <View className='at-article container'>
        <AtButton type='primary' onClick={this.getNew}>
          生成一条彩虹屁
        </AtButton>
        <View className='at-article__content'>
          <View className='at-article__h3 content'>{rainbow}</View>
        </View>
      </View>
    );
  }
}

export default Index;
