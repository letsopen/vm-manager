import Storage from '../../utils/storage';
import { VPSApi } from '../../utils/api';

Page({
  data: {
    totalServers: 0,
    errorServers: 0,
    serverStatusList: []
  },

  onLoad: async function() {
    await this.refreshServerStatus();
  },

  onShow: async function() {
    await this.refreshServerStatus();
  },

  async refreshServerStatus() {
    const servers = await Storage.getServers();
    let errorCount = 0;
    const statusList = [];

    for (const server of servers) {
      const api = new VPSApi(server.type, server.config);
      try {
        const status = await api.getServerStatus();
        statusList.push({
          id: server.id,
          name: server.name,
          status: status.online,
          location: status.location,
          ip: status.ip
        });
        if (!status.online) errorCount++;
      } catch (e) {
        errorCount++;
        statusList.push({
          id: server.id,
          name: server.name,
          status: false,
          location: server.location,
          ip: server.ip
        });
      }
    }

    this.setData({
      totalServers: servers.length,
      errorServers: errorCount,
      serverStatusList: statusList
    });
  }
}); 