import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../service/user.service';
import { SharedModule } from '../../shared/shared.module';
import Chart, { CategoryScale } from 'chart.js/auto';
import { DatePipe } from '@angular/common';

Chart.register(CategoryScale);
@Component({
  selector: 'app-dashbord',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dashbord.component.html',
  styleUrl: './dashbord.component.scss',
  providers:[
    DatePipe
  ]
})
export class DashbordComponent implements OnInit {

  workouts:any;
  activities:any;

  statsData:any;

  @ViewChild('workoutLineChart') private workoutLineChart:ElementRef;
  @ViewChild('activityLineChart') private activityLineChart:ElementRef;

  constructor(private userService:UserService,private datePipe:DatePipe){}
  ngOnInit(): void {
    this.getStats();
    this.getGraphsStats();
  }

  getStats(){
    this.userService.getStats().subscribe(res=>{
      this.statsData=res;
    })
  }

  getGraphsStats(){
    this.userService.getGraphsStats().subscribe(res=>{
      this.workouts=res.workouts;
      this.activities=res.activities;
      if(this.workoutLineChart || this.activityLineChart){
        this.createLineChart();
      }
      
    })
  }

  ngAfterViewInit(){
    if(this.workouts&&this.activities){
      this.createLineChart();
    }
  }
  createLineChart() {
    const workoutCtx=this.workoutLineChart.nativeElement.getContext('2d');
    const activityCtx=this.activityLineChart.nativeElement.getContext('2d');

    new Chart(workoutCtx, {
      type: 'line',
      data: {
        labels: this.workouts.map((data:{date:any;})=>this.datePipe.transform(data.date,'MM/dd')),
        datasets: [{
          label: 'Calories Burned',
          data: this.workouts.map((data:{caloriesBurned:any;})=>data.caloriesBurned),
          fill:false,
          borderWidth: 1,
          backgroundColor:'rgba(80,200,120,0.6)',
          borderColor: 'rgba(0,100,0,1)',
        },
      
        {
          label: 'Duration',
          data: this.workouts.map((data:{duration:any})=>data.duration),
          fill:false,
          borderWidth: 2,
          backgroundColor:'rgba(120,180,200,0.6)',
          borderColor: 'rgba(0,100,150,1)',
        }
      ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    new Chart(activityCtx, {
      type: 'line',
      data: {
        labels: this.activities.map((data:{date:any;})=>this.datePipe.transform(data.date,'MM/dd')),
        datasets: [{
          label: 'Calories Burned',
          data: this.activities.map((data:{caloriesBurned:any;})=>data.caloriesBurned),
          fill:false,
          borderWidth: 1,
          backgroundColor:'rgba(255,100,100,0.6)',
          borderColor: 'rgba(255,0,0,1)',
        },
      
        {
          label: 'Steps',
          data: this.activities.map((data:{steps:any})=>data.steps),
          fill:false,
          borderWidth: 2,
          backgroundColor:'rgba(255,180,120,0.6)',
          borderColor: 'rgba(255,100,0,1)',
        },
        {
          label: 'Distance',
          data: this.activities.map((data:{distance:any;})=>data.distance),
          fill:false,
          borderWidth: 2,
          backgroundColor:'rgba(255,200,200,0.6)',
          borderColor: 'rgba(255,0,100,1)',
        },
      ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

}
