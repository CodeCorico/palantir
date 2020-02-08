<script>
import 'chartjs-plugin-datalabels';
import { Line } from 'vue-chartjs';

const COLORS = { stories: '#997f36', debts: '#c2865a' };

export default {
  name: 'sprints-chart',
  extends: Line,
  props: {
    labels: Array,
    stories: Array,
    debts: Array,
  },
  mounted () {
    this.updateChart();
  },
  watch: {
    labels() {
      this.updateChart();
    },
    stories() {
      this.updateChart();
    },
    debts() {
      this.updateChart();
    },
  },
  methods: {
    updateChart() {
      this.renderChart({
        labels: this.labels,
        datasets: [{
          yAxisID: 'y-axis-stories',
          fill: false,
          pointBackgroundColor: COLORS.stories,
          pointBorderColor: COLORS.stories,
          borderColor: COLORS.stories,
          data: this.stories,
          datalabels: {
            color: COLORS.stories,
          }
        }, {
          yAxisID: 'y-axis-debts',
          fill: false,
          pointBackgroundColor: COLORS.debts,
          pointBorderColor: COLORS.debts,
          borderColor: COLORS.debts,
          data: this.debts,
          datalabels: {
            color: COLORS.debts,
            formatter: value => `${value}%`,
          },
        }],
      }, {
        layout: {
          padding: { top: 50 },
        },
        plugins: {
          datalabels: {
            align: 'top',
            offset: 10,
            font: { size: 20 },
          }
        },
        scales: {
          yAxes: [{
            id: 'y-axis-stories',
            display: false,
          }, {
            id: 'y-axis-debts',
            display: false,
            ticks: { min: 0, max: 100 },
          }],
          xAxes: [{
            ticks: {
              fontColor: COLORS.stories,
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
