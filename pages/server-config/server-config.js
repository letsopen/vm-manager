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

  onLoad: async function(options) {
    const { type, id } = options;
    this.setData({ type, serverId: id });

    if (id) {
      const servers = await Storage.getServers();
      const server = servers.find(s => s.id === id);
      if (server) {
        this.setData({
          formData: {
            name: server.name,
            apiUrl: server.config.apiUrl,
            apiKey: server.config.apiKey,
            apiSecret: server.config.apiSecret
          }
        });
      }
    }
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
      id: this.data.serverId || Date.now().toString(),
      type: this.data.type,
      name,
      config: {
        apiUrl,
        apiKey,
        apiSecret
      }
    };

    try {
      const servers = await Storage.getServers();
      let updatedServers;
      
      if (this.data.serverId) {
        updatedServers = servers.map(s => 
          s.id === this.data.serverId ? serverData : s
        );
      } else {
        updatedServers = [...servers, serverData];
      }

      await Storage.saveServers(updatedServers);
      
      wx.showToast({
        title: '保存成功',
        icon: 'success'
      });

      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    } catch (e) {
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      });
    }
  },

  handleCancel() {
    wx.navigateBack();
  }
}); 