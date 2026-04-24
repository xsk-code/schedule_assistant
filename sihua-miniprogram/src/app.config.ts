export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/history/index',
    'pages/detail/index',
    'pages/mine/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    backgroundColor: '#F5F0E8',
    navigationBarBackgroundColor: '#2C2420',
    navigationBarTitleText: '别蛮干',
    navigationBarTextStyle: 'white',
    navigationStyle: 'custom'
  },
  tabBar: {
    color: '#8C7E72',
    selectedColor: '#C4463A',
    backgroundColor: '#F5F0E8',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '开卷',
        iconPath: 'assets/tabbar/home.png',
        selectedIconPath: 'assets/tabbar/home-active.png'
      },
      {
        pagePath: 'pages/history/index',
        text: '案卷',
        iconPath: 'assets/tabbar/history.png',
        selectedIconPath: 'assets/tabbar/history-active.png'
      }
    ]
  }
});
