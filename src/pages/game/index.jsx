import React, { Component } from 'react';
import { View, Text, Video } from '@tarojs/components';
import { observer, inject } from 'mobx-react';

import { AtGrid } from 'taro-ui';
import './index.scss';

@inject('store')
@observer
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      myAnwser: ['', '', '', ''],
    };
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  wordClick = (item) => {
    console.log(item);
    // const { myAnwser } = this.state;
    // let anwser = [];
    // myAnwser.forEach((v, i) => {
    //   if (!v) {
    //     v = item;
    //     return;
    //   }
    //   anwser[i] = v;
    // });
    // this.setState({
    // })
  };

  render() {
    const options = '气原比向金岛么又命或刚髅质看第此但骷利道';

    const { myAnwser } = this.state;
    // const {
    //   homeStore: { rainbow },
    // } = this.props.store;
    return (
      <View className='game'>
        <View className='movie-desc'>
          <Text className='desc'>美国部队进入无人岛，一不小心就会被吃掉</Text>
        </View>
        <View className='movie-wrap'>
          <Video
            style='width: 100%;height:205px'
            src='https://sf1-ttcdn-tos.pstatp.com/obj/developer/sdk/1534422848153.mp4'
            poster='https://misc.aotu.io/booxood/mobile-video/cover_900x500.jpg'
            initialTime='0'
            id='video'
            autoplay
            controls
            loop={false}
            muted={false}
            showFullscreenBtn={false}
            showPlayBtn={false}
            enableProgressGesture={false}
            showProgress={false}
          />
        </View>

        <View className='content-wrap at-row at-row__justify--between at-row__align--center'>
          <View className='see-anwser'>查看电影名</View>
          <View className='coin-tip'>
            <View className='coin'>我的积分:120</View>
            <View className='tip'>从下面20个字中选出正确的片名</View>
          </View>
          <View className='next-movie'>猜下一部</View>
        </View>

        <View className='write-wrap '>
          <View className='anwser at-row at-row__justify--center'>
            {myAnwser.map((item, index) => {
              return (
                <View key={index} className='word'>
                  {item}
                </View>
              );
            })}
          </View>
          <View className='options at-row at-row--wrap at-row__justify--between'>
            {options.split('').map((item, index) => {
              return (
                <View
                  className='word'
                  key={index}
                  // onClick={this.wordClick(item)}
                >
                  {item}
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  }
}

export default Index;
