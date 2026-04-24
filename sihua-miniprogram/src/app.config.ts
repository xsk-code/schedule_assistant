export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/history/index',
    'pages/detail/index',
    'pages/mine/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#1C1917',
    navigationBarTitleText: '别蛮干',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#A8A29E',
    selectedColor: '#1C1917',
    backgroundColor: '#FFFFFF',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: 'assets/tabbar/home.png',
        selectedIconPath: 'assets/tabbar/home-active.png'
      },
      {
        pagePath: 'pages/history/index',
        text: '历史',
        iconPath: 'assets/tabbar/history.png',
        selectedIconPath: 'assets/tabbar/history-active.png'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的',
        iconPath: 'assets/tabbar/mine.png',
        selectedIconPath: 'assets/tabbar/mine-active.png'
      }
    ]
  }
});
