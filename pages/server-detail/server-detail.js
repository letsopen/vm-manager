import Storage from '../../utils/storage';
import { VPSApi } from '../../utils/api';

Page({
  data: {
    loading: false,
    serverId: '',
    serverInfo: {}
  },

  onLoad: function(options) {
    this.setData({ serverId: options.id });
    this.loadServerDetail();
  },

  onPullDownRefresh() {
    this.loadServerDetail().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  async loadServerDetail() {
    if (this.data.loading) return;
    
    this.setData({ loading: true });
    wx.showLoading({ title: '加载中' });

    try {
      const servers = await Storage.getServers();
      const server = servers.find(s => s.id === this.data.serverId);
      if (!server) {
        throw new Error('服务器不存在');
      }

      const api = new VPSApi(server.type, server.config);
      const status = await api.getServerStatus();

      this.setData({
        serverInfo: {
          ...server,
          ...status
        }
      });
    } catch (e) {
      wx.showToast({
        title: '获取服务器信息失败',
        icon: 'none'
      });
    } finally {
      this.setData({ loading: false });
      wx.hideLoading();
    }
  },

  async handleRestart() {
    wx.showModal({
      title: '确认重启',
      content: '确定要重启该服务器吗？',
      success: async (res) => {
        if (res.confirm) {
          const servers = await Storage.getServers();
          const server = servers.find(s => s.id === this.data.serverId);
          const api = new VPSApi(server.type, server.config);
          
          wx.showLoading({ title: '重启中' });
          try {
            await api.restartServer();
            wx.showToast({ title: '重启成功' });
            setTimeout(() => this.loadServerDetail(), 5000);
          } catch (e) {
            wx.showToast({
              title: '重启失败',
              icon: 'none'
            });
          } finally {
            wx.hideLoading();
          }
        }
      }
    });
  }
}); 