import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { DateFormatter } from '../DateConverter';
import { PaginateGetDTO } from 'src/app/DTOs/PaginateGetDTO';
import { TaskDashboardDTO, TaskGetDTO } from 'src/app/DTOs/TaskDTO';
import { TaskService } from 'src/app/Services/task.service';
import { STATUS, PRIORITY } from '../const';

@Component({
  selector: 'app-task-table',
  templateUrl: './task-table.component.html',
  styleUrls: ['./task-table.component.scss'],
  providers: [DialogService]
})

//? Utilized for displaying task table in "Dashboard" and task list of a project for a "CLIENT"
export class TaskTableComponent implements OnInit {

  STATUS = STATUS; PRIORITY = PRIORITY;
  dateFormatter = new DateFormatter();
  isLoading: boolean = false;
  //* Pagination 
  pagination: PaginateGetDTO; // To check the pagination details 
  paginateTask: TaskDashboardDTO[]; // Store the "docs" stored in the pagination details
  // Default: Display 1st page, each page with 3 rows only
  @Input() page: number;
  //? Either "Dashboard" / "Project"
  @Input() navigationPage: 'Project' | 'Dashboard';
  @Input() rowPerPageOptions: number[];
  @Input() limit: number;
  @Input() project_id: string;


  constructor
  (
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
  }
  
  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  async onPageChange($event): Promise<void>{
    this.page = $event.page + 1;
    this.limit = $event.rows;
    await this.loadData();
  }

  async loadData(): Promise<void>{
    this.isLoading = true;
    //? For "MANAGER" && "ENGINEER"
    if(!this.isNavigatingFromProject()){
      this.pagination = await this.taskService.getPaginateTask(this.page, this.limit);
    }
    //? Viewing task list at "Project-Details"
    else if(this.isNavigatingFromProject()){
      this.pagination = await this.taskService.getProjectPaginateTask(this.project_id, this.page, this.limit);
    }

    if(this.pagination){
      this.paginateTask = [];

      for(const task of this.pagination['docs'] as TaskGetDTO[]){
        const dashboardTask: TaskDashboardDTO = {
          _id: task._id,
          name: task.name,
          due_date: task.due_date,
          completed_date: task.completed_date,
          status: task.status,
          priority: task.priority,
          selectedLeaderID: task.selectedLeaderID,
          selectedEngineersID: task.selectedEngineersID,
          selectedLeader: this.isNavigatingFromProject() ? task.selectedLeader : undefined,
          selectedEngineers: this.isNavigatingFromProject() ? task.selectedEngineers : [],
        }

        this.paginateTask.push(dashboardTask);
      }
    }

    this.isLoading = false;
    this.cdr.detectChanges();
  }

  displayDetails(task: TaskDashboardDTO){
    this.router.navigate(
      ['/crafted/pages/profile/campaigns', task._id], 
      { 
        relativeTo: this.route,
        state:{ task: task },
      });
  }

  isNavigatingFromProject(): boolean{ return this.navigationPage == "Project" }
}
