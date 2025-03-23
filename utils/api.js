const API_TYPES = {
  SOLUSVM: 'solusvm',
  BANDWAGONHOST: 'bandwagonhost',
  CLOUDCONE: 'cloudcone'
};

class VPSApi {
  constructor(type, config) {
    this.type = type;
    this.config = config;
  }

  async getServerStatus() {
    switch(this.type) {
      case API_TYPES.SOLUSVM:
        return this.getSolusVMStatus();
      case API_TYPES.BANDWAGONHOST:
        return this.getBandwagonStatus();
      case API_TYPES.CLOUDCONE:
        return this.getCloudconeStatus();
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

export { API_TYPES, VPSApi }; 