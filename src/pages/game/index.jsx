import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import {
  View,
  Text,
  Video,
  Image,
  Swiper,
  SwiperItem,
} from '@tarojs/components';
import { AtCurtain } from 'taro-ui';
import { observer, inject } from 'mobx-react';
import './index.scss';

@inject('store')
@observer
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      options: ['王牌对王牌', '唐人街探案', '千与千寻', '花木兰'],
      showYinDao: true,
      active: null,
      isOpenedFail: false,
      isOpenedSucc: false,
    };
  }

  componentWillMount() {}

  componentDidMount() {
    this._nextMovie();
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  //开始游戏
  _nextMovie = async () => {
    const { counterStore } = this.props.store;
    await counterStore.getOneMovie();
    const { options } = counterStore;
    this.setState({
      options: options,
    });
  };

  //查看完整片名
  _watchMovieTitle = () => {
    const { counterStore } = this.props.store;
    const { oneMovie } = counterStore;
    this._onCloseFail();
    // 创建激励视频
    const videoAd = Taro.createRewardedVideoAd({
      adUnitId: '1cc8wlr6hjyl99n6i8',
    });
    // 广告创建后默认是隐藏的，可以通过该方法显示广告
    videoAd.show();
    //捕捉错误
    videoAd.onError((err) => {
      // 进行适当的提示
      Taro.showToast({ title: '加载错误', icon: 'fail' });
    });
    // 监听关闭
    videoAd.onClose((status) => {
      if ((status && status.isEnded) || status === undefined) {
        // 正常播放结束，下发奖励
        Taro.showModal({
          title: '您查看的影视名称',
          content: `《${oneMovie.title}》`,
          showCancel: false,
        });
      } else {
        // 播放中途退出，进行提示
        Taro.showToast({ title: '查看失败', icon: 'fail' });
      }
    });

    this.onClose();
  };

  //切换下一部
  _swiperChange = (e) => {
    // console.log(e.detail);
    this._nextMovie();
    this.setState({
      showYinDao: false,
      active: null,
    });
  };

  //选择选项
  _changeOption = (index) => {
    this.setState({ active: index });
  };

  //确认答案
  _confirm = async () => {
    const { active, options } = this.state;
    const { counterStore } = this.props.store;
    const { oneMovie, point } = counterStore;
    if (point >= 30) {
      if (active != null) {
        const data = await counterStore.anwser({
          movie_id: oneMovie.id,
          words: options[active],
        });
        data.state == 1
          ? this.setState({ isOpenedSucc: true })
          : this.setState({ isOpenedFail: true });
      } else {
        Taro.showToast({ title: '请选中选项', icon: 'fail' });
      }
    } else {
      Taro.showModal({
        title: '您的积分不足',
        content: '剩余积分不足\n完成签到奖励100积分',
        confirmColor: '#FD2C57',
        success: (res) => {
          if (res.confirm) {
            Taro.navigateTo({ url: '../signin/index' });
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        },
      });
    }
  };

  _onCloseFail() {
    this.setState({
      isOpenedFail: false,
    });
  }
  _onCloseSucc() {
    this.setState({
      isOpenedSucc: false,
    });
  }

  render() {
    const {
      counterStore: { oneMovie, point },
    } = this.props.store;
    let poster =
      oneMovie.url + '?x-oss-process=video/snapshot,t_0,f_jpg,w_0,h_205,m_fast';
    const { showYinDao, active, options } = this.state;
    const serialNumber = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
    ];

    return (
      <View className='game'>
        <View className='movie-desc'>
          <Text className='desc'>{oneMovie.note}</Text>
        </View>
        {showYinDao ? (
          <Image
            className='yindao'
            src='https://p2-static.oss-cn-beijing.aliyuncs.com/MiniApp/pmccc/images/yindao.png'
          />
        ) : null}
        <Swiper
          className='movie-wrap'
          circular
          onChange={this._swiperChange.bind(this)}
        >
          <SwiperItem className='movie-item item-1'>
            <Video
              style='width: 100%;'
              src={oneMovie.url}
              poster={poster}
              initialTime='0'
              id='video'
              autoplay={false}
              controls
              loop={false}
              muted={false}
              showFullscreenBtn
              showPlayBtn
              playBtnPosition='center'
              enableProgressGesture={false}
              showProgress={false}
            />
          </SwiperItem>
          <SwiperItem className='movie-item item-1'>
            <Video
              style='width: 100%;'
              src={oneMovie.url}
              poster={poster}
              initialTime='0'
              id='video'
              autoplay={false}
              controls
              loop={false}
              muted={false}
              showFullscreenBtn
              showPlayBtn
              playBtnPosition='center'
              enableProgressGesture={false}
              showProgress={false}
            />
          </SwiperItem>
        </Swiper>

        <View className='write-wrap'>
          <View className='coin-tip'>当前积分:{point}</View>
          <View className='options'>
            <View className='tip'>从下面4个选项中选出正确的片名</View>
            <View className='option-items'>
              {options.map((item, index) => {
                return (
                  <View
                    key={index}
                    className={classnames({
                      item: true,
                      active: active == index ? true : false,
                    })}
                    onClick={this._changeOption.bind(this, index)}
                  >
                    {serialNumber[index]}:{item}
                  </View>
                );
              })}
            </View>
          </View>
          <View className='confirm' onClick={this._confirm.bind(this)}></View>
        </View>

        {/* 失败弹窗 */}
        <AtCurtain
          isOpened={this.state.isOpenedFail}
          onClose={this._onCloseFail.bind(this)}
        >
          <View className='curtain-wrap'>
            <Image
              className='icon'
              src='https://p2-static.oss-cn-beijing.aliyuncs.com/MiniApp/pmccc/images/cry_icon.png'
            />
            <Image
              className='info'
              src='https://p2-static.oss-cn-beijing.aliyuncs.com/MiniApp/pmccc/images/info-icon.png'
            />
            <View className='price'>-30积分</View>
            <View className='video-name'>《******》</View>
            <View
              className='watch-answer'
              onClick={this._watchMovieTitle.bind(this)}
            >
              <Image
                className='video-icon'
                src='https://p2-static.oss-cn-beijing.aliyuncs.com/MiniApp/pmccc/images/video-icon.png'
              />
              <Text>看视频查看片名</Text>
            </View>
          </View>
        </AtCurtain>
        {/* 成功弹窗 */}
        <AtCurtain
          isOpened={this.state.isOpenedSucc}
          onClose={this._onCloseSucc.bind(this)}
        >
          <View className='curtain-wrap'>
            <Image
              className='icon'
              src='https://p2-static.oss-cn-beijing.aliyuncs.com/MiniApp/pmccc/images/success_icon.png'
            />
            <Image
              className='info'
              src='https://p2-static.oss-cn-beijing.aliyuncs.com/MiniApp/pmccc/images/success_text_icon.png'
            />
            <View className='price'>+10积分</View>
            <View className='video-name'>《{oneMovie.title}》</View>
            <View
              className='watch-answer'
              onClick={this._onCloseSucc.bind(this)}
            >
              <Text>继续答题</Text>
            </View>
          </View>
        </AtCurtain>
      </View>
    );
  }
}

export default Index;
