import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AlertService, LoaderService, RoleService } from 'src/app/core/services/index';
import { GridComponent,ConfirmationDialogueComponent} from 'src/shared/components/index';

@Component({
    selector: 'app-role-list',
    templateUrl: './role-list.component.html',
    styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit {
    @ViewChild(GridComponent) gridComponent: GridComponent;

    jscolumnDefs: any[];
    role: any[];
    totalRoles: number;
    jsfilter: any = {};
    selectedRowId;
    isShowAdd: boolean = false;

    constructor(
        private router: Router,
        private roleService: RoleService,
        private alertService: AlertService,
        private loaderService: LoaderService,
        public dialog: MatDialog) { }

    ngOnInit() {
        this.getGridData();
    }

    /**
        * Call the ColumnDefs and Roles.
        */
    getGridData() {
        this.getColumnDefs();
        this.getRoles();
    }

    /**
       * Initializing the Grid with Data
       */
    getColumnDefs() {
        const _this = this;
        this.jscolumnDefs = [

            { title: 'Name', width: 92, name: 'name' },
            {
                title: 'Active', width: 50, name: 'active', itemTemplate: function (active) {
                    var iconClass = "";
                    if (active == true) {
                        iconClass = "fa fa-check";
                    }
                    else {
                        iconClass = "fa fa-close";
                    }
                    return $("<span>").attr("class", iconClass);
                }
            },
            {
                title: 'Action', width: 70, itemTemplate: (__, data) => {
                    this.selectedRowId = data.id;
                    const updateIcon = $("<span data-toggle='tooltip' data-placement='bottom' title='Edit'>").append("<i class='fa fa-pencil-square-o mr-3'  >").on("click", () => this.performCurdOperation('update', data.id));
                    const deleteIcon = $("<span data-toggle='tooltip' data-placement='bottom' title='Disabled'>").append("<i class='fa fa-trash-o mr-3'>").on("click", () => this.openDialog());
                    return $("<span>").append(updateIcon).append(deleteIcon);
                }
            }
        ];
    }

    /**
    * Perform Update or Delete Operation..
    */
    performCurdOperation(action, id) {
        switch (action) {
            case 'update':
                // this.router.navigate(['/admin/user-form'], { queryParams: { id: this.selectedRowId } });
                break;
            case 'delete':
                this.showLoader();
                this.roleService.deleteData(id).subscribe(res => {
                    this.hideLoader();
                    this.alertService.successToastr("Selected Role Deleted Successfully.", false);
                    this.gridComponent.deleteRowListener(id);
                }, error => {
                    this.hideLoader();
                    this.alertService.errorToastr("Error in Deleting Role.", false);
                });
                break;
        }
    }

    /**
     * Open confirmation dialogue.
     * On confirmation, deletes selected row of grid.
     */
    openDialog() {
        const dialogRef = this.dialog.open(ConfirmationDialogueComponent, {
            width: '250px',
            data: {
                message: 'Want to Delete Data?'
            }
        });

        if (dialogRef) {
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.performCurdOperation('delete', this.selectedRowId);
                }
            });
        }
    }

    /**
   * Get Roles on the base of page index.
   */
    getRoles(pageindex: number = 1) {
        this.showLoader();
        this.roleService.getPagedRole(pageindex).subscribe((roles: any) => {
            this.hideLoader();
            this.role = roles.data;
            this.totalRoles = roles.total;
        }, error => {
            this.hideLoader();
            this.alertService.errorToastr("Error in Getting roles.", false);
        });
    }

    /**
     * Perform Add Operation
     */
    performOperation(event: any) {
        switch (event.action) {
            case 'add':
                this.router.navigate(['/admin/role-form']);
                break;
        }
    }

    /**
   * Show the loader screen
   */
    showLoader() {
        this.loaderService.show();
    }

    /**
     * Hide the Loader Screen
     */
    hideLoader() {
        this.loaderService.hide();
    }
}
