import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { View, Text, Image } from '@tarojs/components';
import { AtCurtain } from 'taro-ui';
import { observer, inject } from 'mobx-react';
import './index.scss';

@inject('store')
@observer
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      id: 3, //电影id
      point: Taro.getStorageSync('point') || 100, //初始积分
      exactAnwser: '', //准确答案
      bullet: [], //弹幕列表
      active: null, //选中的选项
      options: [
        '王牌对王牌',
        '唐人街探案',
        '千与千寻',
        '花木兰',
        '地质灾难',
        '灭顶之灾',
      ], //选项
      isOpenedFail: false, //失败弹窗开关
      isOpenedSucc: false, //成功弹窗开关
    };
  }

  componentWillMount() {}

  componentDidMount() {
    const { id } = this.state;
    this._initGame(id);
    this._getGoalRecord(id);
    try {
      !Taro.getStorageSync('point') ? Taro.setStorageSync('point', 100) : null;
    } catch (error) {}
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

  //进入游戏
  _initGame = async (id) => {
    const { goalStore } = this.props.store;
    await goalStore.getGoalMovie({ goal_movie_id: id });
    const { oneMovie, options } = goalStore;
    this.setState({
      exactAnwser: oneMovie.title,
      options: options,
    });
  };

  //查看完整片名
  _watchMovieTitle = () => {
    const { exactAnwser } = this.state;
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

  //选择选项
  _changeOption = (index) => {
    this.setState({ active: index });
  };

  //确认答案
  _confirm = async () => {
    const { active, options, point } = this.state;
    const { goalStore } = this.props.store;
    const { oneMovie } = goalStore;
    if (point >= 30) {
      if (active != null) {
        if (options[active] == oneMovie.title) {
          this.setState({ isOpenedSucc: true });
        } else {
          Taro.setStorageSync('point', point - 30);
          this.setState({
            isOpenedFail: true,
            point: Taro.getStorageSync('point'),
          });
        }
      } else {
        Taro.showToast({ title: '请选中选项', icon: 'fail' });
      }
    } else {
      Taro.showModal({
        title: '提示',
        content: '积分不足,点击确定看视频查看片名',
        success: (res) => {
          if (res.confirm) {
            this._watchMovieTitle();
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
  _ToHomePage() {
    this.setState({
      isOpenedSucc: false,
    });
    Taro.reLaunch({ url: '../index/index' });
  }

  render() {
    const {
      goalStore: { oneMovie },
    } = this.props.store;
    const { bullet, exactAnwser, options, active, point } = this.state;
    let title = new Array(exactAnwser.length).fill('*'); //全隐藏
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
          <Text className='desc'>
            《&nbsp;&nbsp;
            {title.map((item, i) => {
              return (
                <Text className='name' key={i}>
                  *
                </Text>
              );
            })}
            》
          </Text>
        </View>
        {/* 弹幕 */}
        <View className='displayGroup'>
          <View
            className='dmGroup top'
            style='animation: dmAnimation2 30s linear 1s infinite;'
          >
            {bullet.map((item, i) => {
              if (i < 10) {
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
            style='animation: dmAnimation2 40s linear 1s infinite; '
          >
            {bullet.map((item, ind) => {
              if (ind >= 10 && ind < 20) {
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
              if (inde >= 20 && inde < 30) {
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
            style='animation: dmAnimation2 40s linear 1s infinite; '
          >
            {bullet.map((item, indes) => {
              if (indes >= 30) {
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
        {/* 答题卡 */}
        <View className='write-wrap'>
          <View className='coin-tip'>当前积分:{point}</View>
          <View className='options'>
            <View className='tip'>从下面选项中选出正确的片名</View>
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
        {/* 底部规则 */}
        <View className='game-rule'>
          <View className='title'>
            <Text className='text'>游戏规则</Text>
          </View>
          <View className='content'>
            <View className='rule rule1'>
              1.竞猜玩法：猜对电影奖励10积分，猜错电影扣30积分，查看片名扣100积分，查看电影名和猜对电影记录都会在个人中心里查看；
            </View>
            <View className='rule rule2'>
              2.积分用途：积分用于猜电影片名和查看电影名称，初始积分100分，每日签到奖励100积分，连续签到越多奖励越多；
            </View>
          </View>
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
            <View className='video-name'>《{title.join('')}》</View>
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
          className='success'
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
              onClick={this._ToHomePage.bind(this)}
            >
              <Text>去首页继续答题</Text>
            </View>
          </View>
        </AtCurtain>
      </View>
    );
  }
}

export default Index;
