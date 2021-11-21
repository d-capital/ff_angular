import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TasksApiService } from 'src/app/services/tasks.services';

@Component({
  selector: 'app-task-status',
  templateUrl: './task-status.component.html',
  styleUrls: ['./task-status.component.css']
})
export class TaskStatusComponent implements OnInit {
  serverErrors = [];
  taskStatus: string = '';
  showTasks: boolean = true;

  constructor(
    private taskStatusApi: TasksApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('auth_token');
    this.taskStatusApi.getTaskStatus(token).pipe().subscribe(data=>{
      var status_data = JSON.stringify(data);
      var status = JSON.parse(status_data)['status'];
      var task_status = JSON.parse(status_data)['task_status'];
      if(status === 'success' && task_status == 'Ready to Look At'){
        this.showTasks = true;
        this.taskStatus = JSON.parse(status_data)['task_status'];
        document.getElementById('seeResultBtn').removeAttribute("disabled");
        document.getElementById('taskStatus').setAttribute('color','green');
      } else if(status === 'success' && task_status !== 'Ready to Look At') {
        this.showTasks = true;
        this.taskStatus = JSON.parse(status_data)['task_status'];
      }else{
        this.showTasks = false;
      };
      }, err => { 
        const validationErrors = err.error;
        this.showTasks = false;
        if (err instanceof HttpErrorResponse) {
          
          if (err.status === 422) {
            this.serverErrors = err.error.message
          }
      }
    });
  }
  seeOptimizationResults(){
    localStorage.setItem('isTempPortfolio','true');
    localStorage.setItem('pId', '0');
    this.router.navigate(['single-portfolio']);
  }

}
