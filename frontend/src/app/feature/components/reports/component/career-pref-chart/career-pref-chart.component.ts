import { Component, Input, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-career-pref-chart',
  templateUrl: './career-pref-chart.component.html',
  styleUrls: ['./career-pref-chart.component.scss']
})
export class CareerPrefChartComponent {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  @Input() careerData: any = {};

  public barChartOptions1: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
        beginAtZero: true,
        title: {
          display: false,
          text: 'Count' // X-axis title for horizontal chart
        },
        ticks: {
          callback: function(value) {
            return Number.isInteger(value) ? value : null; // Show only integer values
          },
        },
      },
      y: {
        stacked: true,
        ticks: {
          autoSkip: false // Prevent skipping labels
        },
        title: {
          display: true,
          //text: 'Career Titles' // Y-axis title for horizontal chart
          text: ''
        },
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: '#ffffff'
      },
    },
    indexAxis: 'y', // Set to y to make the chart horizontal
  };
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
        beginAtZero: true,
        title: {
          display: false,
          text: 'Count'
        },
        ticks: {
          callback: function(value) {
            return Number.isInteger(value) ? value : null;
          },
        },
        grid: {
          display: true,
          color: '#e0e0e0',
          lineWidth: 1,
        },
      },
      y: {
        stacked: true,
        ticks: {
          autoSkip: false
        },
        title: {
          display: true,
          //text: 'Career Titles'
          text: ''
        },
        grid: {
          drawOnChartArea: false, // Prevent drawing horizontal grid lines
        },
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: '#ffffff'
      },
    },
    indexAxis: 'y',
  };
  

  public barChartType: ChartType = 'bar'; // Use 'bar' for horizontal chart
  public barChartPlugins = [DataLabelsPlugin];

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Trending Career Preferences',
        backgroundColor: "#3573EB",
        borderColor: "rgb(54, 162, 235)",
        barPercentage: 0.6, // Adjust the width of the bars
        categoryPercentage: 0.9 // Adjust spacing between bars
      },
    ],
  };

  ngOnInit() {
    this.updateChartData();
  }

  ngOnChanges() {
    this.updateChartData();
  }

  private updateChartData() {
    const xAxislist = this.careerData.map((item: { careerTitle: any; }) => item.careerTitle);
    const yAxisList = this.careerData.map((item: { count: any; }) => Number(item.count)); // Convert counts to numbers

    this.barChartData.labels = xAxislist;
    this.barChartData.datasets[0].data = yAxisList;
  }

  // events
  public chartClicked({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {}

  public chartHovered({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {}
}
