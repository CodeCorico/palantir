<script>
export default {
  name: 'sprints-chart',
  extends: window.VueChartJs.Line,
  props: {
    labels: Array,
    values: Array,
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
          fill: false,
          pointBackgroundColor: '#997f36',
          pointBorderColor: '#997f36',
          borderColor: '#997f36',
          data: this.values,
        }],
      }, {
        layout: {
          padding: {
            top: 50,
          },
        },
        plugins: {
          datalabels: {
            color: '#997f36',
            align: 'top',
            offset: 10,
            font: {
              size: 20,
            },
          }
        },
        scales: {
          yAxes: [{
            display: false,
          }],
          xAxes: [{
            ticks: {
              fontColor: '#997f36',
              fontSize: 16,
            },
            gridLines: {
              drawBorder: false,
              display: false,
            },
          }],
        },
        title: { display: false },
        legend: { display: false },
        maintainAspectRatio: false,
      });
    }
  }
};
</script>
