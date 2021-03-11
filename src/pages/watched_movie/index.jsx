import React, { Component } from 'react';
import { View, Video } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
import Taro from '@tarojs/taro';

import './index.scss';

@inject('store')
@observer
class Index extends Component {
  state = {
    indexCurrent: '',
  };
  componentWillMount() {}

  componentDidMount() {
    const { counterStore } = this.props.store;
    counterStore.getMyWatchList({ page: 1 });
  }

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

  _onPlay(e) {
    var curIdx = e.currentTarget.id;
    // 没有播放时播放视频
    // console.log(curIdx);
    if (!this.state.indexCurrent) {
      this.setState({
        indexCurrent: curIdx,
      });
      var videoContext = Taro.createVideoContext(curIdx, this); //这里对应的视频id
      videoContext.play();
    } else {
      // 有播放时先将prev暂停，再播放当前点击的current
      var videoContextPrev = Taro.createVideoContext(
        this.state.indexCurrent,
        this
      ); //this是在自定义组件下，当前组件实例的this，以操作组件内 video 组件（在自定义组件中药加上this，如果是普通页面即不需要加）
      if (this.state.indexCurrent != curIdx) {
        // console.log(123);
        videoContextPrev.pause();
        this.setState({
          indexCurrent: curIdx,
        });
        var videoContextCurrent = Taro.createVideoContext(curIdx, this);
        videoContextCurrent.play();
      }
    }
  }

  render() {
    const { counterStore } = this.props.store;
    const { myWatchList } = counterStore;

    return (
      <View className='watched-movie'>
        {myWatchList.map((item, index) => {
          return (
            <View key={index} className='movie-item'>
              <View className='desc'>{item?.movie.title}</View>
              <Video
                className='video'
                style='width: 100%; height:216px'
                src={item?.movie.url}
                autoplay={false}
                poster={
                  item?.movie.url +
                  '?x-oss-process=video/snapshot,t_0,f_jpg,w_0,h_205,m_fast'
                }
                initialTime='0'
                id={'video' + item?.movie.id}
                controls
                onPlay={this._onPlay.bind(this)}
                loop={false}
                muted={false}
                showFullscreenBtn
                showPlayBtn
                playBtnPosition='center'
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
