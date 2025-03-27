class VPSApi {
  constructor(type, config) {
    this.type = type;
    this.config = config;
  }

  async getServerStatus() {
    if (this.type === 'bandwagonhost') {
      return this.getBandwagonStatus();
    }
    // ... 其他类型的处理 ...
  }

  async getBandwagonStatus() {
    try {
      const url = `${this.config.apiUrl}/v1/getServiceInfo?veid=${this.config.apiKey}&api_key=${this.config.apiSecret}`;
      
      // 使用 Promise 包装 wx.request
      const response = await new Promise((resolve, reject) => {
        wx.request({
          url,
          method: 'GET',
          success: res => resolve(res),
          fail: err => reject(err)
        });
      });

      // 检查响应状态
      if (!response.data) {
        throw new Error('API响应数据为空');
      }

      const data = response.data;
      
      if (data.error !== 0) {
        throw new Error(`API请求失败: ${data.message || '未知错误'}`);
      }

      // 计算总流量（GB）
      const totalTraffic = (data.plan_monthly_data * data.monthly_data_multiplier) / (1024 * 1024 * 1024);
      
      // 计算已用流量（GB）
      const usedTraffic = data.data_counter / (1024 * 1024 * 1024);
      
      // 计算流量重置时间
      const resetDate = new Date(data.data_next_reset * 1000); // 转换为毫秒
      const resetTimeStr = resetDate.toLocaleString('zh-CN', {
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      return {
        status: !data.suspended, // 服务器状态（未被暂停即为在线）
        totalTraffic: parseFloat(totalTraffic.toFixed(2)),
        usedTraffic: parseFloat(usedTraffic.toFixed(2)),
        availableTraffic: parseFloat((totalTraffic - usedTraffic).toFixed(2)),
        resetTime: resetTimeStr,
        ip: data.ip_addresses[0] || '',
        location: data.node_datacenter || '',
        // 添加调试信息
        debug: {
          rawData: data
        }
      };
    } catch (error) {
      console.error('获取Bandwagon状态失败：', error);
      console.error('API URL:', `${this.config.apiUrl}/v1/getServiceInfo?veid=${this.config.apiKey}&api_key=***`);
      throw error;
    }
  }

  async restartServer() {
    switch(this.type) {
      case API_TYPES.SOLUSVM:
        return this.restartSolusVM();
      case API_TYPES.BANDWAGONHOST:
        return this.restartBandwagon();
      case API_TYPES.CLOUDCONE:
        return this.restartCloudcone();
    }
  }

  // 具体实现各个API的方法...
}

export const API_TYPES = {
  SOLUSVM: 'solusvm',
  BANDWAGONHOST: 'bandwagonhost',
  CLOUDCONE: 'cloudcone'
};

export { VPSApi }; 