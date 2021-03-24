import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image, Button } from '@tarojs/components';
import { AtCurtain } from 'taro-ui';
import { observer, inject } from 'mobx-react';
import './index.scss';
import MovieIcon from '../../assets/movie_icon.png';

@inject('store')
@observer
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      id: 4,
      index: 0, //填写文字下标
      watchNum: 0,
      myAnwser: [], // 我的答案
      exactAnwser: '', //准确答案
      isGameOver: false, //游戏是否结束
      bullet: [], //弹幕列表
      isOpened: false, //弹窗开关
    };
  }

  componentWillMount() {}

  componentDidMount() {
    const { id } = this.state;
    this._initGame(id);
    this._getGoalRecord(id);
  }

  componentWillUnmount() {}

  componentDidShow() {
    try {
      const { id } = Taro.getCurrentInstance().router.params;
      this.setState({
        id,
      });
    } catch (error) {}
  }

  componentDidHide() {}

  //弹幕
  _getGoalRecord = async (id) => {
    const { goalStore } = this.props.store;
    await goalStore.getGoalRecord({ goal_movie_id: id });
    const { record } = goalStore;
    this.setState({
      bullet: record,
    });
  };

  //点击答案区域
  anwserClick = (index) => {
    const { myAnwser, isGameOver } = this.state;
    if (isGameOver) return false;
    for (let i = index; i < myAnwser.length; i++) {
      myAnwser[i] = '';
    }
    this.setState({
      myAnwser,
      index,
    });
  };

  //点击文字区域
  wordClick = (item) => {
    const { myAnwser, index, exactAnwser, isGameOver } = this.state;
    if (isGameOver) return false;
    myAnwser.splice(index, 1, item);
    this.setState({
      myAnwser,
      index: index + 1,
    });
    // todo 判断是否与正确答案一质
    if (myAnwser.join('').length === exactAnwser.length) {
      if (myAnwser.join('') === exactAnwser) {
        Taro.showModal({
          title: '结果',
          content: '恭喜你回答正确! 积分+5\n点击确定进入首页',
          showCancel: false,
          success: () => {
            Taro.reLaunch({ url: '../index/index' });
          },
        });
      } else {
        Taro.showModal({
          title: '结果',
          content: '很遗憾回答错误! 积分-10\n点击确定查看完整片名',
          showCancel: false,
          success: () => {
            // Taro.reLaunch({ url: '../index/index' });
            console.log('点击确定');
          },
        });
      }
      //结束
      this.setState({
        isGameOver: true,
      });
    }
  };

  //进入游戏
  _initGame = async (id) => {
    //开始游戏
    this.setState({
      isGameOver: false,
    });
    const { goalStore } = this.props.store;
    await goalStore.getGoalMovie({ goal_movie_id: id });
    const { oneMovie } = goalStore;
    let myAnwser = new Array(oneMovie.title.length).fill('');
    this.setState({
      myAnwser,
      exactAnwser: oneMovie.title,
      index: 0,
    });
  };

  //查看片名
  _watchMovieTitle = async (id) => {
    let watchNum = this.state.watchNum;
    let index = this.state.index;
    if (watchNum < 2 && index < 2) {
      const { myAnwser, exactAnwser } = this.state;
      const { goalStore } = this.props.store;
      await goalStore.getGoalMovie({ goal_movie_id: id });
      let anwser = myAnwser;
      watchNum++;
      if (index > exactAnwser.length - 1) {
        index = exactAnwser.length;
      } else {
        anwser[index] = exactAnwser[index];
      }
      this.setState({
        myAnwser: anwser,
        watchNum: watchNum,
        index: index + 1,
      });
      if (myAnwser.join('').length === exactAnwser.length) {
        if (myAnwser.join('') === exactAnwser) {
          Taro.showModal({
            title: '结果',
            content: '恭喜你回答正确! 积分+5\n点击确定进入首页',
            success: () => {
              Taro.reLaunch({ url: '../index/index' });
            },
          });
        } else {
          Taro.showModal({
            title: '结果',
            content: '很遗憾回答错误! 积分-10\n点击确定查看完整片名',
            success: () => {
              // Taro.reLaunch({ url: '../index/index' });
              console.log('点击确定');
            },
          });
        }
        //结束
        this.setState({
          isGameOver: true,
        });
      }
    } else {
      this.handleChange();
    }
  };

  //玩法规则
  _gameRule = () => {
    Taro.showModal({
      title: '玩法规则',
      content:
        '免费查看片名前两个字\n查看全名需观看广告\n猜对片名有积分奖励\n积分只用于电影竞猜',
      confirmColor: '#FD2C57',
      showCancel: false,
    });
  };

  //弹窗
  handleChange() {
    this.setState({
      isOpened: true,
    });
  }
  onClose() {
    this.setState({
      isOpened: false,
    });
  }

  //查看完整片名
  _watchFullMovieTitle = () => {
    const { exactAnwser } = this.state;
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
        let myAnwser = exactAnwser.split('');
        this.setState({
          isGameOver: true,
          myAnwser,
          index: myAnwser.length,
        });
        Taro.showModal({
          title: '您查看的影视名称',
          content: `《${exactAnwser}》\n点击确定进入首页`,
          showCancel: false,
          success: (res) => {
            Taro.reLaunch({ url: '../index/index' });
          },
        });
      } else {
        // 播放中途退出，进行提示
        Taro.showToast({ title: '查看失败', icon: 'fail' });
      }
    });

    this.onClose();
  };

  //分享
  onShareAppMessage(res) {
    if (res.from === 'button') {
      return {
        channel: 'video', // 必写 video
        templateId: '12kbbinj6h1oib3cad', // 分享的模版 id
        title: '快来猜猜看', // 分享的标题
        desc: '猜片名有奖励', // 分享的内容介绍
        path: `/pages/index/index`, // 分享的路径
        extra: {
          videoTopics: ['片名猜猜猜', '电影猜猜猜'], // 只有抖音才会有的属性
        },
      };
    } else {
      // 右上角分享
      return {
        templateId: '12kbbinj6h1oib3cad', //分享的模版 id
        title: '快来猜猜看', //分享的标题
        desc: '猜片名有奖励', // 分享的内容
        path: `/pages/index/index`, // 分享的路径
      };
    }
  }

  render() {
    const {
      goalStore: { words },
    } = this.props.store;

    const { myAnwser, bullet, exactAnwser, id } = this.state;
    let hideName = new Array(exactAnwser.length).fill('*').join(''); //全隐藏
    let halfName = exactAnwser.substr(0, 2) + hideName.substr(2); //半隐藏

    return (
      <View className='game'>
        <View className='movie-desc'>
          <Text className='desc'>
            《&nbsp;&nbsp;
            {myAnwser.map((item, i) => {
              return (
                <Text className='name' key={i}>
                  *
                </Text>
              );
            })}
            》
          </Text>
        </View>
        <View
          className='see-anwser'
          onClick={this._watchMovieTitle.bind(this, id)}
        >
          点击查看片名
        </View>

        <View className='displayGroup'>
          <View
            className='dmGroup top'
            style='animation: dmAnimation2 30s linear 1s infinite;'
          >
            {bullet.map((item, i) => {
              if (i < 8) {
                return (
                  <View className='dmItem' key={item.id}>
                    <View className='dm'>
                      <View className='avatarBox'>
                        <image src={item.avatar} className='avatar'></image>
                      </View>
                      <Text className='name'>{item.nickname}:</Text>
                      <Text className='type'>【{item.typeName}】</Text>
                      <Text className='time'>{item.created_at}</Text>
                    </View>
                  </View>
                );
              }
            })}
          </View>
          <View
            className='dmGroup mid'
            style='animation: dmAnimation2 30s linear 1s infinite; '
          >
            {bullet.map((item, ind) => {
              if (ind >= 8 && ind < 16) {
                return (
                  <View className='dmItem' key={item.id}>
                    <View className='dm'>
                      <View className='avatarBox'>
                        <image src={item.avatar} className='avatar'></image>
                      </View>
                      <Text className='name'>{item.nickname}:</Text>
                      <Text className='type'>【{item.typeName}】</Text>
                      <Text className='time'>{item.created_at}</Text>
                    </View>
                  </View>
                );
              }
            })}
          </View>
          <View
            className='dmGroup btm'
            style='animation: dmAnimation2 45s linear 1s infinite; '
          >
            {bullet.map((item, inde) => {
              if (inde >= 16 && inde < 24) {
                return (
                  <View className='dmItem' key={item.id}>
                    <View className='dm'>
                      <View className='avatarBox'>
                        <image src={item.avatar} className='avatar'></image>
                      </View>
                      <Text className='name'>{item.nickname}:</Text>
                      <Text className='type'>【{item.typeName}】</Text>
                      <Text className='time'>{item.created_at}</Text>
                    </View>
                  </View>
                );
              }
            })}
          </View>
          <View
            className='dmGroup btm2'
            style='animation: dmAnimation2 30s linear 1s infinite; '
          >
            {bullet.map((item, indes) => {
              if (indes >= 24) {
                return (
                  <View className='dmItem' key={item.id}>
                    <View className='dm'>
                      <View className='avatarBox'>
                        <image src={item.avatar} className='avatar'></image>
                      </View>
                      <Text className='name'>{item.nickname}:</Text>
                      <Text className='type'>【{item.typeName}】</Text>
                      <Text className='time'>{item.created_at}</Text>
                    </View>
                  </View>
                );
              }
            })}
          </View>
        </View>

        <AtCurtain
          isOpened={this.state.isOpened}
          onClose={this.onClose.bind(this)}
          closeBtnPosition='top-right'
        >
          <View className='curtain-wrap'>
            <View className='title'>查看全名</View>
            <View className='movie-title'>《{halfName}》</View>
            <View className='tips-1'>两次提示机会已用完</View>
            <View className='tips-2'>需要观看视频 显示完整片名</View>
            <View
              className='curtain-btn'
              onClick={this._watchFullMovieTitle.bind(this)}
            >
              <Image src={MovieIcon} className='movie-icon' />
              <Text className='btn'>查看完整片名</Text>
            </View>
          </View>
        </AtCurtain>

        <View className='write-wrap '>
          <View className='anwser at-row at-row__justify--center'>
            {myAnwser.map((item, i) => {
              return (
                <View
                  key={i}
                  className='word'
                  onClick={this.anwserClick.bind(this, i)}
                >
                  {item}
                </View>
              );
            })}
          </View>

          <View className='tip'>从下面20个字中选出正确的片名</View>

          <View className='options at-row at-row--wrap at-row__justify--between'>
            {words?.map((item, i) => {
              return (
                <View
                  className='word'
                  key={i}
                  onClick={this.wordClick.bind(this, item)}
                >
                  {item}
                </View>
              );
            })}
          </View>
        </View>

        {/* 底部 */}
        <View className='game-rule'>
          <View className='title'>
            <Text className='text'>游戏规则</Text>
          </View>
          <View className='content'>
            <View className='rule rule1'>
              1.竞猜玩法：猜对电影奖励5积分，猜错电影扣10积分，查看片名扣100积分，查看电影名和猜对电影记录都会在个人中心里查看；
            </View>
            <View className='rule rule2'>
              2.积分用途：积分用于猜电影片名和查看电影名称，初始积分100分，每日签到奖励100积分，连续签到越多奖励越多；
            </View>
            <View className='rule rule3'>
              3.免费查看片名前两个字,查看全名需观看广告,猜对片名有积分奖励。
            </View>
          </View>
        </View>
        {/* <Button open-type='share' data-channel='video'>
          拍视频
        </Button> */}
      </View>
    );
  }
}

export default Index;
