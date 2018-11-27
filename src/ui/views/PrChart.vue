<script>
export default {
  name: 'ui-pr-chart',
  extends: window.VueChartJs.Doughnut,
  props: {
    values: Array,
  },
  mounted () {
    this.renderChart({
      labels: ['Lines added', 'Lines removed'],
      datasets: [{
        data: this.values,
        backgroundColor: ['rgba(88, 216, 163, 0.4)', 'rgba(244, 118, 123, 0.4)'],
        borderColor: ['rgba(88, 216, 163, 0.8)', 'rgba(244, 118, 123, 0.8)'],
        borderWidth: [1, 1],
      }],
    }, {
      layout: {
        padding: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10,
        },
      },
      title: { display: false },
      legend: { display: false },
      cutoutPercentage: 93,
      responsive: true,
      maintainAspectRatio: true,
    });
  }
};
</script>
