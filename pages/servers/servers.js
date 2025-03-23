import Storage from '../../utils/storage';
import { VPSApi, API_TYPES } from '../../utils/api';

Page({
  data: {
    servers: [],
    loading: false
  },

  onLoad: async function() {
    await this.loadServers();
  },

  onShow: async function() {
    await this.loadServers();
  },

  onPullDownRefresh: async function() {
    await this.loadServers();
    wx.stopPullDownRefresh();
  },

  async loadServers() {
    this.setData({ loading: true });
    try {
      const servers = await Storage.getServers();
      for (const server of servers) {
        const api = new VPSApi(server.type, server.config);
        try {
          const status = await api.getServerStatus();
          server.status = status.online;
          server.totalTraffic = status.totalTraffic;
          server.availableTraffic = status.availableTraffic;
        } catch (e) {
          server.status = false;
        }
      }
      this.setData({ servers });
    } catch (e) {
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  goToDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/server-detail/server-detail?id=${id}`
    });
  },

  showAddServer() {
    wx.showActionSheet({
      itemList: ['SolusVM', 'Bandwagonhost', 'Cloudcone'],
      success: (res) => {
        const types = [API_TYPES.SOLUSVM, API_TYPES.BANDWAGONHOST, API_TYPES.CLOUDCONE];
        this.showConfigForm(types[res.tapIndex]);
      }
    });
  },

  showConfigForm(type) {
    wx.navigateTo({
      url: `/pages/server-config/server-config?type=${type}`
    });
  },

  async editServer(e) {
    const { id } = e.currentTarget.dataset;
    const server = this.data.servers.find(s => s.id === id);
    if (!server) return;

    wx.navigateTo({
      url: `/pages/server-config/server-config?type=${server.type}&id=${id}`
    });
  },

  async deleteServer(e) {
    const { id } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除该服务器吗？此操作不可恢复。',
      success: async (res) => {
        if (res.confirm) {
          try {
            const servers = await Storage.getServers();
            const updatedServers = servers.filter(s => s.id !== id);
            await Storage.saveServers(updatedServers);
            
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            });
            
            await this.loadServers();
          } catch (e) {
            wx.showToast({
              title: '删除失败',
              icon: 'none'
            });
          }
        }
      }
    });
  }
}); 