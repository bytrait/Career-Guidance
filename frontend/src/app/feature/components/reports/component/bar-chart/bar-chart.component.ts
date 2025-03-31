import { Component, Input, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { PersonalityTestService } from 'src/app/shared/services/personality-test.service';


@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  constructor(private _personalityTestService: PersonalityTestService) {

  }

  @Input() personalityData:any = {}
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 0,
        max:50
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        color:':#ffffff'
      },
    },
    color:':#ffffff'
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [DataLabelsPlugin];

  public barChartData: ChartData<'bar'> = {
    labels: [],
    
    datasets: [
      { data: [] ,
        label: 'Strength',
        backgroundColor: "#3573EB",
        borderColor: "rgb(54, 162, 235)"
      },
    ],
  };

  // events
  public chartClicked({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
   // console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
   // console.log(event, active);
  }

  public randomize(): void {
    // Only Change 3 values
    this.barChartData.datasets[0].data = [
      Math.round(Math.random() * 100),
      59,
      80,
      Math.round(Math.random() * 100),
      56,
      Math.round(Math.random() * 100),
      40,
    ];

    this.chart?.update();
  }

  pickHighest(obj: any, num = 1) {
    const requiredObj: any = {};
    if (num > Object.keys(obj).length) {
      return false;
    };
    Object.keys(obj).sort((a, b) => obj[b] - obj[a]).forEach((key, ind) => {
      if (ind < num) {
        let name = key?.split("(")[1]?.split(")")[0];
        requiredObj[name] = obj[key];
      }
    });
    return requiredObj;
  };
  ngOnInit() {

   
    // const { A, C, E, N, O } = scoreByCategoryType;
    let labels: any = [];
    let xAxislist: any = [];
    let yAxisList: any = [];

    // Object.entries(personalityData).forEach((categoryType:any) => {
      xAxislist = [
        this.personalityData['aPersonality']?.type,
        this.personalityData['cPersonality']?.type,
        this.personalityData['ePersonality']?.type,
        this.personalityData['nPersonality']?.type,
        this.personalityData['oPersonality']?.type,
      ]
 
      yAxisList = [
        this.personalityData['aPersonality']?.score,
        this.personalityData['cPersonality']?.score,
        this.personalityData['ePersonality']?.score,
        this.personalityData['nPersonality']?.score,
        this.personalityData['oPersonality']?.score,
      ]
 
    //  xAxislist.push(...Object.keys(this.pickHighest(numbersObject, 2)))
    //  yAxisList.push(...Object.values(this.pickHighest(numbersObject, 2)))
    // });

    

  this.barChartOptions= {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 0,
        max:Math.max(...yAxisList)
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'center',
        align: 'center',
        color:'#ffffff'
      },
    },
  }
    this.barChartData.labels = xAxislist;
    this.barChartData.datasets = [
      {
        backgroundColor: "#3573EB",
        borderColor: "rgb(54, 162, 235)",
        data: [...yAxisList],
        label: 'Strength',
      }
    ];


  }

  ngOnChanges() {

   
    // const { A, C, E, N, O } = scoreByCategoryType;
    let labels: any = [];
    let xAxislist: any = [];
    let yAxisList: any = [];

    // Object.entries(personalityData).forEach((categoryType:any) => {
      xAxislist = [
        this.personalityData['aPersonality']?.type,
        this.personalityData['cPersonality']?.type,
        this.personalityData['ePersonality']?.type,
        this.personalityData['nPersonality']?.type,
        this.personalityData['oPersonality']?.type,
      ]
 
      yAxisList = [
        this.personalityData['aPersonality']?.score,
        this.personalityData['cPersonality']?.score,
        this.personalityData['ePersonality']?.score,
        this.personalityData['nPersonality']?.score,
        this.personalityData['oPersonality']?.score,
      ]
 
    //  xAxislist.push(...Object.keys(this.pickHighest(numbersObject, 2)))
    //  yAxisList.push(...Object.values(this.pickHighest(numbersObject, 2)))
    // });

    

  this.barChartOptions= {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 0,
        max:Math.max(...yAxisList)
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'center',
        align: 'center',
        color:'#ffffff'
      },
    },
  }
    this.barChartData.labels = xAxislist;
    this.barChartData.datasets = [
      {
        backgroundColor: "#3573EB",
        borderColor: "rgb(54, 162, 235)",
        data: [...yAxisList],
        label: 'Strength',
      }
    ];


  }
}
