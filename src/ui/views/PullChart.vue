<script>
import 'chartjs-plugin-datalabels';
import { Doughnut } from 'vue-chartjs';

export default {
  name: 'ui-pull-chart',
  extends: Doughnut,
  props: {
    values: Array,
  },
  mounted () {
    this.updateChart();
  },
  watch: {
    values() {
      this.updateChart();
    },
  },
  methods: {
    updateChart() {
      this.renderChart({
        labels: ['Lines added', 'Lines removed'],
        datasets: [{
          data: this.values,
          backgroundColor: ['rgba(88, 216, 163, 0.4)', 'rgba(244, 118, 123, 0.4)', 'transparent'],
          borderColor: ['rgba(88, 216, 163, 0.8)', 'rgba(244, 118, 123, 0.8)', 'transparent'],
          borderWidth: [1, 1, 0],
        }],
      }, {
        plugins: {
          datalabels: {
            display: false,
          },
        },
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
    },
  },
};
</script>
