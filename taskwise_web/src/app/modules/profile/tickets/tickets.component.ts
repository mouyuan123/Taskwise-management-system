// REMOVE ANY REDUNDANT CODES
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateTicketFormComponent } from 'src/app/form-modal/ticket/create-ticket-form.component';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginateGetDTO } from 'src/app/DTOs/PaginateGetDTO';
import { TicketService } from 'src/app/Services/ticket.service';
import { AuthService } from '../../auth';
import { TicketGetDTO } from 'src/app/DTOs/TicketDTO';
import { TICKET_STATUS } from 'src/app/utils/const';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
  providers: [DialogService]
})
export class TicketsComponent implements OnInit {

  isLoadingTic$: Observable<boolean>;
  isLoadingUser$: Observable<boolean>;
  isLoadingPro: boolean;
  //* Actual list of tickets
  tickets: TicketGetDTO[] | undefined;
  //* Tickets to be displayed to clients
  displayedTickets: TicketGetDTO[] = [];
  //* To sort the ticket based on "Pending / On Hold / Completed"
  sort_options: string[] = ["All", TICKET_STATUS.PENDING, TICKET_STATUS.REOPENED, TICKET_STATUS.SOLVED];
  selectedStatus: String = this.sort_options[0];
  currentDate: Date;
  //* Pagination 
  pagination: PaginateGetDTO; // To check the pagination details 
  paginateTicket: TicketGetDTO[]; // Store the "docs" stored in the pagination details
  // Default: Display 1st page, each page with 3 rows only
  page: number  = 1;
  limit: number = 4;

  ref: DynamicDialogRef;


  constructor
  (
    private dialogService: DialogService,
    private ticketService: TicketService,
    private userService: UserService,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  )
  {
    this.isLoadingTic$ = this.ticketService.isLoading$;
    this.isLoadingUser$ = this.userService.isLoading$;

    //* 1. Get the queryParams (E.g., page, limit for retrieving the correct page where the user navigate from)
    const page = this.route.snapshot.queryParamMap.get('page');
    const limit = this.route.snapshot.queryParamMap.get('limit');
    //* 2. If they does exist, fetch the correct data
    if(page) this.page = parseInt(page);
    if(limit) this.limit = parseInt(limit);
  }

  async ngOnInit(): Promise<void> {
    //* Get today's date
    this.currentDate = new Date();
    //* Ignore the "Hour"
    this.currentDate.setHours(0, 0, 0, 0);
    await this.loadData();
  }

  async loadData(): Promise<void>{
    //* 1. Get ticket list based on user roles (deals in backend)
    this.pagination = await this.ticketService.getPaginateTicket(this.page, this.limit);

    if(this.pagination){
      this.paginateTicket = this.pagination['docs'] as TicketGetDTO[];
      
      this.sortTicketByStatus(this.selectedStatus);
      this.cdr.detectChanges();
    }

    //* Append the pagination details to the `current` route
    this.router.navigate([],
      {
        relativeTo: this.route,
        queryParams: { page: this.page, limit: this.limit },
        queryParamsHandling: 'merge'
      })
  }

  sortTicketByStatus($event): void{
    this.selectedStatus = $event;
    if($event == "All"){
      this.displayedTickets = this.paginateTicket.filter((ticket: TicketGetDTO) => ticket.status != $event);
    }
    else{
      this.displayedTickets = this.paginateTicket.filter((ticket: TicketGetDTO) => ticket.status == $event);
    }  
  }

  async onPageChange($event): Promise<void>{
    this.page = $event.page + 1;
    this.limit = $event.rows;
    await this.loadData();
  }

  //* Allow "CLIENT" to manage ticket
  openTicketForm(): void{
    // Show a ticket form
    this.ref = this.dialogService.open(CreateTicketFormComponent, 
      {
        header: "Create Ticket",
        width: '80%',
      });

    this.ref.onClose.subscribe(async() => await this.loadData());
  }

  displayDetails(ticket: TicketGetDTO){
    this.router.navigate
    (
      //* 1. Route to navigate
      [ticket._id], 
      { 
        relativeTo: this.route,
        //* 2. Data to be passed when navigate to next route (Note: data lost after page refreshing)
        state: { ticket: ticket }
      },
    );
  }  
}
