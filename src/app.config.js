export default {
  pages: ['pages/index/index', 'pages/epidemic/index'],
  tabBar: {
    list: [
      {
        iconPath: 'assets/home.png',
        selectedIconPath: 'assets/home-selected.png',
        pagePath: 'pages/index/index',
        text: '首页',
      },
      {
        iconPath: 'assets/user.png',
        selectedIconPath: 'assets/user-selected.png',
        pagePath: 'pages/epidemic/index',
        text: '我的',
      },
    ],
    color: '#B0B0B0',
    selectedColor: '#5695FF',
    backgroundColor: '#fff',
    borderStyle: '#B0B0B0',
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'Dgee',
    navigationBarTextStyle: 'black',
  },
};
