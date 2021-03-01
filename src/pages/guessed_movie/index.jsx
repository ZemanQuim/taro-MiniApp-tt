import React, { Component } from 'react';
import { View, Video } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
import Taro from '@tarojs/taro';

import './index.scss';

@inject('store')
@observer
class Index extends Component {
  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  //监听用户下拉刷新事件
  onPullDownRefresh() {
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  }

  onReachBottom() {
    console.log('监听用户上拉触底事件');
  }

  render() {
    const MovieList = [{}, {}, {}];

    return (
      <View className='guessed-movie'>
        {MovieList.map((item, index) => {
          return (
            <View key={index} className='movie-item'>
              <View className='desc'>这是电影描述,这是电影描述</View>
              <Video
                style='width: 100%; height:216px'
                src='https://sf1-ttcdn-tos.pstatp.com/obj/developer/sdk/1534422848153.mp4'
                autoplay={false}
                poster='https://misc.aotu.io/booxood/mobile-video/cover_900x500.jpg'
                initialTime='0'
                id='video'
                controls
                loop={false}
                muted={false}
                showFullscreenBtn={false}
                showPlayBtn={false}
                enableProgressGesture={false}
                showProgress={false}
              />
            </View>
          );
        })}
        <View className='bottom-text'>已经到底了</View>
      </View>
    );
  }
}

export default Index;
