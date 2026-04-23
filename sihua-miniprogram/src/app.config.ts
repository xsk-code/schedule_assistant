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
    navigationBarTitleText: '四化节奏师',
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
        text: '首页'
      },
      {
        pagePath: 'pages/history/index',
        text: '历史'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
});
