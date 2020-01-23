<script>
export default {
  name: 'capacity-chart',
  extends: window.VueChartJs.HorizontalBar,
  props: {
    labels: Array,
    values: Object,
  },
  mounted () {
    this.updateChart();
  },
  watch: {
    labels() {
      this.updateChart();
    },
    values() {
      this.updateChart();
    },
  },
  methods: {
    updateChart() {
      this.renderChart({
        labels: this.labels,
        datasets: [{
            name: 'todo',
            backgroundColor: '#67676733',
            stack: 'stack 0',
            data: this.values.todo || [],
            datalabels: {
              backgroundColor: '#676767',
            }
          }, {
            name: 'doing',
            backgroundColor: '#07b3b933',
            stack: 'stack 0',
            data: this.values.doing || [],
            datalabels: {
              backgroundColor: '#07b3b9',
            }
          }, {
            name: 'done',
            backgroundColor: '#07b94e33',
            stack: 'stack 0',
            data: this.values.done || [],
            datalabels: {
              backgroundColor: '#07b94e',
            }
          }],
      }, {
        title: { display: false },
        legend: { display: false },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            align: 'end',
            anchor: 'start',
            offset: 5,
            color: '#fff',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            borderRadius: 5,
            font: {
              size: 16,
            },
            padding: {
              top: 5,
              left: 5,
              bottom: 5,
            },
            display: function(context) {
              return !!context.dataset.data[context.dataIndex];
            },
            formatter: function(value, context) {
              if (context.dataset.name !== 'done') {
                return value;
              }

              const { datasets } = context.chart.data;
              const todoCount = datasets[0].data[context.dataIndex];
              const doingCount = datasets[1].data[context.dataIndex];
              const percent = Math.round(value * 100 / (todoCount + doingCount + value));

              return `${value} (${percent}%)`;
            },
          }
        },
        layout: {
          padding: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          },
        },
        scales: {
          xAxes: [{
            stacked: true,
            display: false,
          }],
          yAxes: [{
            stacked: true,
            categoryPercentage: 1.0,
            barPercentage: 0.99,
            ticks: {
              fontSize: 16,
              fontColor: 'rgba(255, 255, 255, 0.8)',
            },
            gridLines: {
              color: '#2c293c',
              lineWidth: 2,
            },
            afterFit: function(scaleInstance) {
              scaleInstance.width = 200;
            },
          }]
        },
      });
    },
  },
};
</script>
