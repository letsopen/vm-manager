const STORAGE_KEYS = {
  SERVERS: 'vps_servers'
};

class Storage {
  static async saveServers(servers) {
    try {
      await wx.setStorage({
        key: STORAGE_KEYS.SERVERS,
        data: servers
      });
    } catch (e) {
      console.error('保存服务器信息失败:', e);
    }
  }

  static async getServers() {
    try {
      const { data } = await wx.getStorage({ key: STORAGE_KEYS.SERVERS });
      return data || [];
    } catch (e) {
      return [];
    }
  }
}

export default Storage; 