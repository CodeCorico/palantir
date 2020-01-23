<script>
export default {
  name: 'active-sprint-chart',
  extends: window.VueChartJs.Pie,
  props: {
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
        labels: ['To do', 'Doing', 'Done'],
        datasets: [{
          fill: false,
          data: this.values,
          backgroundColor: ['#dcdcdc', '#6998fc', '#4cbaab'],
          borderWidth: 0,
        }],
      }, {
        plugins: {
          datalabels: {
            color: '#ffffffdd',
            display: function(context) {
              return !!context.dataset.data[context.dataIndex];
            },
          },
        },
        title: { display: false },
        legend: { display: false },
        responsive: true,
        maintainAspectRatio: true,
      });
    },
  },
};
</script>
