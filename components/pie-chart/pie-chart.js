Component({
  properties: {
    title: String,
    used: Number,
    total: Number,
    unit: String
  },

  data: {
    percentage: 0
  },

  lifetimes: {
    attached() {
      this.initChart();
    }
  },

  observers: {
    'used,total': function(used, total) {
      this.setData({
        percentage: total > 0 ? (used / total * 100).toFixed(1) : 0
      });
      this.drawChart();
    }
  },

  methods: {
    async initChart() {
      const query = this.createSelectorQuery();
      const canvas = await new Promise(resolve => {
        query.select('#pieChart')
          .fields({ node: true, size: true })
          .exec((res) => resolve(res[0]));
      });

      if (!canvas) return;

      const ctx = canvas.node.getContext('2d');
      const dpr = wx.getSystemInfoSync().pixelRatio;
      canvas.node.width = canvas.width * dpr;
      canvas.node.height = canvas.height * dpr;
      ctx.scale(dpr, dpr);

      this.canvas = canvas;
      this.ctx = ctx;
      this.drawChart();
    },

    drawChart() {
      if (!this.ctx) return;

      const ctx = this.ctx;
      const canvas = this.canvas;
      const used = this.data.used;
      const total = this.data.total;
      
      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) * 0.8;
      
      // 绘制背景圆
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#f0f0f0';
      ctx.fill();
      
      // 绘制使用量扇形
      if (total > 0) {
        const percentage = used / total;
        const endAngle = -Math.PI / 2 + Math.PI * 2 * percentage;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, -Math.PI / 2, endAngle);
        ctx.fillStyle = percentage > 0.9 ? '#ff4d4f' : '#1890ff';
        ctx.fill();
      }
    }
  }
}); 