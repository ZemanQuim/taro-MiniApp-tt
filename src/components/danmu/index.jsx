import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import { Canvas } from '@tarojs/components';

export default class TestCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bullet: [
        { bullet: '内容1' },
        { bullet: '内容2' },
        { bullet: '内容3' },
        { bullet: '内容4' },
        { bullet: '内容5' },
        { bullet: '内容6' },
        { bullet: '内容7' },
        { bullet: '内容8' },
        { bullet: '内容9' },
      ],
    };
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillReceiveProps = async (nextProps) => {
    console.log(nextProps);
    await this.order();
    this.draw();
  };

  //获取随机值
  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
  }

  // 整理数据
  order = () => {
    const { bullet } = this.props;
    let newbullet = bullet.map((item) => {
      return Object.assign(item, {
        speed: Math.random() * 1 + 1,
        color:
          'rgb(' +
          Math.round(Math.random() * 255) +
          ',' +
          Math.round(Math.random() * 255) +
          ',' +
          Math.round(Math.random() * 255) +
          ')',
        x: 375,
        y: Math.random() * 140 + 16,
        // y: this.getRandomInt(0, 3) * 40 + 16,
      });
    });
    this.setState({
      bullet: newbullet,
    });
  };

  //开始绘制
  draw = () => {
    const ctx = Taro.createCanvasContext('myCanvas', this.$scope);
    function anim() {
      ctx.setFontSize(16);
      // 擦除整个画布
      ctx.clearRect(0, 0, 375, 160);
      // 循环绘制
      const { bullet } = this.state;
      bullet.forEach((item) => {
        ctx.fillStyle = item.color; //字体颜色
        ctx.fillText(item.bullet, item.x, item.y);
        ctx.setFillStyle('red');
        item.x -= item.speed;
        // 调用measureText()来获取TextMertics对象
        let textMertics = ctx.measureText(item.bullet);
        // 根据TextMertics对象获取文字宽度
        let textWidth = textMertics.width;
        // 当弹幕滚动到画布之外的时候，再次回到右边
        if (item.x < -textWidth) {
          item.x = 375;
        }
      });
      ctx.draw();
      requestAnimationFrame(anim.bind(this));
    }
    anim.call(this);
  };

  //随机颜色
  getRandomColor() {
    return (
      '#' +
      (function (color) {
        return (color += '0123456789abcdef'[Math.floor(Math.random() * 16)]) &&
          color.length == 6
          ? color
          : arguments.callee(color);
      })('')
    );
  }

  render() {
    return (
      <Canvas
        canvasId='myCanvas'
        style={{
          width: '375px',
          height: '160px',
        }}
      ></Canvas>
    );
  }
}
