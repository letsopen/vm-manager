import Storage from '../../utils/storage';

Page({
  data: {
    serverId: '',
    type: '',
    formData: {
      name: '',
      apiUrl: '',
      apiKey: '',
      apiSecret: ''
    }
  },

  onLoad(options) {
    console.log('配置页面参数：', options);
    this.setData({
      type: options.type
    });
  },

  async handleSubmit(e) {
    const { name, apiUrl, apiKey, apiSecret } = e.detail.value;
    
    if (!name || !apiUrl || !apiKey || !apiSecret) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    const serverData = {
      id: Date.now().toString(),
      type: this.data.type,
      name,
      config: {
        apiUrl,
        apiKey,
        apiSecret
      }
    };

    // 获取现有服务器列表
    const servers = await Storage.getServers();
    servers.push(serverData);

    // 保存更新后的列表
    await Storage.saveServers(servers);

    wx.showToast({
      title: '添加成功',
      icon: 'success',
      success: () => {
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }
    });
  },

  handleCancel() {
    wx.navigateBack();
  }
}); 