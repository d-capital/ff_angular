import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TasksApiService } from 'src/app/services/tasks.services';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-task-status',
  templateUrl: './task-status.component.html',
  styleUrls: ['./task-status.component.css']
})
export class TaskStatusComponent implements OnInit {
  serverErrors = [];
  taskStatus: string = '';
  showTasks: boolean = true;
  taskStatusSubscription:Subscription;

  constructor(
    private taskStatusApi: TasksApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('user_temp_uid');
    this.taskStatusApi.getTaskStatus(token).pipe().subscribe(data=>{
      var status_data = JSON.stringify(data);
      var status = JSON.parse(status_data)['status'];
      var task_status = JSON.parse(status_data)['task_status'];
      if(status === 'success' && task_status == 'Ready to Look At'){
        this.showTasks = true;
        this.taskStatus = JSON.parse(status_data)['task_status'];
        document.getElementById('mbc-spinner').setAttribute('style','display:none');
        document.getElementById('seeResultBtn').removeAttribute("disabled");
        document.getElementById('seeResultBtn').setAttribute('style','display:block');
        document.getElementById('taskStatus').setAttribute('color','green');
      } else if(status === 'success' && task_status !== 'Ready to Look At') {
        this.showTasks = true;
        this.taskStatus = JSON.parse(status_data)['task_status'];
      };
      }, err => {
        if (err instanceof HttpErrorResponse) {
          
          if (err.status === 404) {
            this.serverErrors = err.error.message
            this.showTasks = false;
            this.taskStatusSubscription.unsubscribe();
            document.getElementById('seeResultBtn').setAttribute('style','display:block');
            document.getElementById('mbc-spinner').setAttribute('style','display:none');
          } else if (err.status === 422) {
            this.serverErrors = err.error.message
          }
        } else {
          this.showTasks = true;
          this.taskStatusSubscription.unsubscribe();
          this.taskStatus = 'Error (try again later)';
          document.getElementById('seeResultBtn').setAttribute('style','display:block');
          document.getElementById('mbc-spinner').setAttribute('style','display:none');
        }
        const validationErrors = err.error;
    });
    this.taskStatusSubscription = interval(10000).subscribe(x => {
      this.refreshStatus();
    });

  }
  seeOptimizationResults(){
    localStorage.setItem('isTempPortfolio','true');
    localStorage.setItem('pId', '0');
    this.router.navigate(['single-portfolio']);
  }
  refreshStatus() {
    const token = localStorage.getItem('user_temp_uid');
    this.taskStatusApi.getTaskStatus(token).pipe().subscribe(data=>{
      var status_data = JSON.stringify(data);
      var status = JSON.parse(status_data)['status'];
      var task_status = JSON.parse(status_data)['task_status'];
      if(status === 'success' && task_status == 'Ready to Look At'){
        this.showTasks = true;
        this.taskStatus = JSON.parse(status_data)['task_status'];
        document.getElementById('mbc-spinner').setAttribute('style','display:none');
        document.getElementById('seeResultBtn').removeAttribute("disabled");
        document.getElementById('seeResultBtn').setAttribute('style','display:block');
        document.getElementById('taskStatus').setAttribute('color','green');
        this.taskStatusSubscription.unsubscribe();
      } else if(status === 'success' && task_status !== 'Ready to Look At') {
        this.showTasks = true;
        this.taskStatus = JSON.parse(status_data)['task_status'];
      };
      }, err => { 
        if (err instanceof HttpErrorResponse) {
          
          if (err.status === 404) {
            this.serverErrors = err.error.message
            this.showTasks = false;
            this.taskStatusSubscription.unsubscribe();
            document.getElementById('seeResultBtn').setAttribute('style','display:block');
            document.getElementById('mbc-spinner').setAttribute('style','display:none');
          } else if (err.status === 422) {
            this.serverErrors = err.error.message
          }
        } else {
          this.showTasks = true;
          this.taskStatusSubscription.unsubscribe();
          this.taskStatus = 'Error (try again later)';
          document.getElementById('seeResultBtn').setAttribute('style','display:block');
          document.getElementById('mbc-spinner').setAttribute('style','display:none');
        }
        const validationErrors = err.error;
    });
  }

}
