// index.ts
// 获取应用实例
const app = getApp<IAppOption>()

Page({
  data: {
    motto: 'Hello World2222',
    isTransform: false,
    radialColor: '',
    resultStyle: '',
    inCenter: false,
    userInfo: {},
    showResult: false,
    showLight: false,
    //                 left: Math.floor(Math.random() * 250) + 400 + "px",
    // top: Math.floor(Math.random() * 220) + "px"
    goodsList: [],
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs',
    })
  },
  // 翻转卡片
  transformCard() {
    const arr:any = this.data.goodsList.map((item:any) => {
      const transform1 = this.data.isTransform ? `rotate(${item.rotate}deg)` : `rotate(${item.rotate}deg) rotateY(-90deg)`;
      const transform2 = this.data.isTransform ? `rotate(${item.rotate}deg) rotateY(-180deg)` : `rotate(${item.rotate}deg) rotateY(-360deg)`;
      return {
        ...item,
        transform1,
        transform2,
      }
    })
    this.setData({
      goodsList: arr,
      isTransform: !this.data.isTransform,
    })
    
  },
  // 移动卡片到中心
  moveCard() {
    if (!this.data.inCenter) {
      wx.createSelectorQuery().select('.mask').boundingClientRect((e) => {
        const arr:any = this.data.goodsList.map((item:any) => {
          return {
            ...item,
            top: (wx.getWindowInfo().screenHeight / 2) - (Math.floor(e.height)) + 'px',
            left: (wx.getWindowInfo().screenWidth / 2) - (Math.floor(e.width) / 2) + 'px'
          }
        })
        this.setData({
          goodsList: arr,
          inCenter: !this.data.inCenter
        })
      }).exec();
    }
  },
  // 打开背景光
  openLight(cb: Function) {
    this.setData({
      showLight: true,
    })
    let count = 0;
    const timer = setInterval(() => {
      if (count === 10) {
        clearInterval(timer)
        cb()
        return
      }
      count++;
      this.setData({
        radialColor: `radial-gradient(circle, rgba(255,255,255,${count/ 10}), rgba(255,255,255,${count/ 10 - 0.2}), rgba(255,255,255,0.1))`
      })
    }, 150)
  },
  onClick() {
    if (this.data.showResult) {
      this.init()
    }
    this.transformCard();
    this.moveCard()
    this.openLight(()=>{
      wx.createSelectorQuery().selectAll('.mask').boundingClientRect((e: any) => {
        this.setData({
          resultStyle: `top:${Math.abs(e[0].top)}px;`,
          showResult: true,
          goodsList: []
        });
        setTimeout(() => {
          this.setData({
            showLight: false,
            resultStyle: `top:${Math.abs(e[0].top)}px;transform: rotateY(720deg)`
          })
        }, 0)
      }).exec()
    })
  },
  init() {
    this.setData({
      showLight: false,
      goodsList: [],
      inCenter: false,
      isTransform: false,
      radialColor: '',
      showResult: false,
      resultStyle: ''
    })
    const arr: any[] = [
      {name:'喜茶', img: 'xicha'},
      {name:'奈雪', img: 'naixue'},
      {name:'书亦', img: 'shuyi'},
      {name:'霸王茶姬', img: 'bawangchaji'},
      {name:'茶颜悦色', img: 'chayanyuese'},
      ];
    const list: any = [];
    arr.forEach(item => {
      const num1 = Math.round(Math.random() * 360);
      const num2 = Math.floor(Math.random() * 250);
      const num3 = Math.floor(Math.random() * (wx.getWindowInfo().screenHeight)) - 200 + 30;
      const obj: any = {
        name: item.name,
        img: `../../imgaes/${item.img}.jpg`,
        top: Math.abs(num3) + 'px',
        left: num2 + 'px',
        rotate: num1,
      }
      obj.transform1 = `rotate(${obj.rotate}deg)`;
      obj.transform2 = `rotate(${obj.rotate}deg) rotateY(-180deg);`;
      list.push(obj)
    })
    this.setData({
      goodsList: list
    })
    console.log(this.data.goodsList)
  },
  onLoad() {
    // @ts-ignore
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
     this.init();
  },
  getUserProfile() {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e: any) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
