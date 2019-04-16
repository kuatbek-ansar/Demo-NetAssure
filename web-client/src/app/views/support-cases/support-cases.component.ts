import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import * as moment from 'moment';
import { SelectItem } from 'primeng/primeng';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { Table } from 'primeng/table';

import { BaseComponent } from '../../containers';
import { SupportCasesService } from '../../services';
import { SupportCaseCommentViewModel, SupportCaseViewModel } from '../../view-models';
import { SupportCase, SupportCaseComment } from '../../../../models';

@Component({
  templateUrl: 'support-cases.component.html',
  styleUrls: [
    '../../../../node_modules/spinkit/css/spinkit.css',
    'support-cases.component.css'
  ],
  encapsulation: ViewEncapsulation.None
})
export class SupportCasesComponent extends BaseComponent implements OnInit {
  detailsLoading: boolean;

  commentsLoading: boolean;

  hasDisplayedCase: boolean;

  hasDisplayedComments: boolean;

  togglingOpenCases: boolean;
  showOpenCases: boolean;
  showAllCases: boolean;
  supportCases: SupportCaseViewModel[];
  selectedSupportCase: SupportCaseViewModel;
  earliestCaseCreatedDate: Date;
  uniqueStatuses: Set<string>;
  statuses: SelectItem[];
  dateOptions: SelectItem[];
  selectedDateFilter: string;
  selectedStatusFilter: string[];
  displayNewCaseForm: boolean;
  newCaseForm: FormGroup;
  caseTypes: string[];
  caseServices: string[];
  caseSeverities: string[];
  caseUsersImpacted: string[];
  newCommentForm: FormGroup;
  displayNewCommentForm: boolean;

  @ViewChild('casesTable') casesTable: Table;

  constructor(private injector: Injector,
              private datePipe: DatePipe,
              private fb: FormBuilder,
              private supportCaseService: SupportCasesService,
              private toasterService: ToasterService) {
    super(injector);

    this.detailsLoading = false;
    this.hasDisplayedCase = false;
    this.commentsLoading = false;
    this.hasDisplayedComments = false;
    this.displayNewCommentForm = false;
    this.uniqueStatuses = new Set<string>();
    this.supportCases = [];
    this.dateOptions = [];

    this.initForms();
  }

  public get filteredByStatus() {
    return this.selectedStatusFilter.length > 0;
  }

  public get commentsFilterable() {
    return this.selectedSupportCase
      && Array.isArray(this.selectedSupportCase.Comments)
      && this.selectedSupportCase.Comments.length > 0;
  }

  public ngOnInit(): void {
    this.getData();
  }

  public getData() {
    this.hasDisplayedCase = false;
    this.hasDisplayedComments = false;
    this.detailsLoading = false;
    this.commentsLoading = false;
    this.Working();

    this.supportCaseService.get().subscribe((data: any) => {
      this.supportCases = data.map(item => {
        item.DateForFiltering = this.createFilterDate(item.CreatedDate);
        this.uniqueStatuses.add(item.Status);
        return new SupportCaseViewModel(item);
      }).sort((x: SupportCaseViewModel, y: SupportCaseViewModel) => x.Id < y.Id);

      this.statuses = Array.from(this.uniqueStatuses).map(str => <SelectItem>{ label: str, value: str });

      this.toggleOpenCases(false);
      this.buildDateFilters();

      this.Ready();
    });
  }

  public buildDateFilters() {
    if (this.supportCases.length > 0) {
      this.earliestCaseCreatedDate = this.supportCases
        .map(item => item.CreatedDate)
        .reduce((minDate, thisDate) => thisDate < minDate ? thisDate : minDate);

      const now = new Date();
      const daysInThisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const daysInLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      const lastEarlierDate = new Date(now.getFullYear(), now.getMonth() - 1, 0);
      const earlierDiffDays = moment(lastEarlierDate).diff(moment(this.earliestCaseCreatedDate), 'days') + 2;

      this.dateOptions.push({
        label: 'Current Month',
        value: Array(...new Array(daysInThisMonth))
          .map((item, index) =>
            this.createFilterDate(new Date(now.getFullYear(), now.getMonth(), index + 1)))
      });

      this.dateOptions.push({
        label: 'Previous Month',
        value: Array(...new Array(daysInLastMonth))
          .map((item, index) =>
            this.createFilterDate(new Date(now.getFullYear(), now.getMonth() - 1, index + 1)))
      });

      if (earlierDiffDays > 0) {
        this.dateOptions.push({
          label: 'Earlier',
          value: Array(...new Array(earlierDiffDays))
            .map((item, index) =>
              this.createFilterDate(
                new Date(
                  this.earliestCaseCreatedDate.getFullYear(),
                  this.earliestCaseCreatedDate.getMonth(),
                  this.earliestCaseCreatedDate.getDate() + index)
              ))
        });
      }
    }
  }

  private initForms() {
    this.newCaseForm = this.fb.group({
      service: ['', Validators.required],
      severity: ['', Validators.required],
      users_impacted: ['', Validators.required],
      site: ['', [Validators.required, Validators.maxLength(50)]],
      subject: ['', [Validators.required, Validators.maxLength(250)]],
      description: ['']
    });

    this.supportCaseService.getPicklistValues('Product__c')
      .subscribe((data: any) => {
        this.caseServices = data.map(item => item.toString()).sort();
      });

    this.supportCaseService.getPicklistValues('Severity__c')
      .subscribe((data: any) => {
        this.caseSeverities = data
          .map(item => item.toString()).filter((item: string) => !item.startsWith('Long Term'));
      });

    this.supportCaseService.getPicklistValues('Users_Impacted__c')
      .subscribe((data: any) => {
        this.caseUsersImpacted = data.map(item => item.toString());
      });

    this.newCommentForm = this.fb.group({
      comment: ['', Validators.required]
    });
  }

  private showCaseForm() {
    this.newCaseForm.reset();
    this.displayNewCaseForm = true;
  }

  public hideCaseForm() {
    this.displayNewCaseForm = false;
  }

  public submitCaseForm() {
    this.displayNewCaseForm = false;
    this.detailsLoading = true;
    this.hasDisplayedCase = false;
    this.commentsLoading = false;
    this.hasDisplayedComments = false;

    this.supportCaseService.create(new SupportCase({
      Service: this.service.value,
      Severity: this.severity.value,
      UsersImpacted: this.users_impacted.value,
      Site: this.site.value,
      Subject: this.subject.value,
      Description: this.description.value
    })).subscribe((response: any) => {
      this.detailsLoading = false;

      if (response.success) {
        this.showSuccess('Success', 'Case created');
        this.ngOnInit();
      } else {
        this.showError('Error', response.errors[0].toString());
      }
    });
  }

  createFilterDate(date) {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  showCommentForm() {
    this.newCommentForm.reset();
    this.displayNewCommentForm = true;
  }

  hideCommentForm() {
    this.displayNewCommentForm = false;
  }

  private submitCommentForm() {
    this.displayNewCommentForm = false;

    this.supportCaseService.createComment(new SupportCaseComment({
      ParentId: this.selectedSupportCase.Id,
      CommentBody: this.comment.value
    })).subscribe((response: any) => {
      if (response.success) {
        this.showSuccess('Success', 'Comment added');

        // Fetch "all" for now, since I wasn't happy with the way lazy loading was working
        this.loadComments({ first: 0, rows: 2000 }, true);
      } else {
        this.showError('Error', response.errors[0].toString());
      }
    });
  }

  onFilter(event: any) {
    if (!this.togglingOpenCases) {
      this.showAllCases = false;
      this.showOpenCases = false;
    }
  }

  private onRowSelect(event: any) {
    this.supportCases.forEach(item => {
      item.IsSelected = false;
    });
    this.selectedSupportCase.IsSelected = true;

    // Assumes Type is never undefined,
    // but value of Type only loads with case details
    if (!this.selectedSupportCase.Type) {
      this.detailsLoading = true;
      this.hasDisplayedCase = false;
      this.hasDisplayedComments = false;

      this.supportCaseService.getDetails(this.selectedSupportCase.Number).subscribe((data: any) => {
        this.selectedSupportCase.fillDetails(data);
        this.detailsLoading = false;
        this.hasDisplayedCase = true;

        // Fetch "all" for now
        this.loadComments({ first: 0, rows: 2000 });
      });
    } else {
      // Fetch "all" for now
      this.loadComments({ first: 0, rows: 2000 });
    }
  }

  private loadComments(event: any, force: boolean = false) {
    if (!this.selectedSupportCase.Comments) {
      this.commentsLoading = true;
      this.hasDisplayedComments = false;
    }

    if (!this.selectedSupportCase.Comments || force) {
      this.supportCaseService.getComments(this.selectedSupportCase.Id, event.first, event.rows).subscribe((data: any) => {
        this.selectedSupportCase.Comments = data.map(item => new SupportCaseCommentViewModel(item));
        this.commentsLoading = false;
        this.hasDisplayedComments = true
      });
    }
  }

  private toggleOpenCases(onlyOpen: boolean) {
    this.togglingOpenCases = true;

    this.showAllCases = !onlyOpen;
    this.showOpenCases = onlyOpen;
    this.selectedDateFilter = '';

    if (onlyOpen) {
      this.selectedStatusFilter = this.statuses
        .map(item => item.value)
        .filter(item => item !== 'Closed');

      // Handles the case where all existing cases are closed.
      // The filter array can't be empty.
      this.selectedStatusFilter.unshift('Status That Will Never Exist');
    } else {
      this.selectedStatusFilter = [];
    }

    // Would like to get rid of this if condition,
    // but the call from ngOnInit fails without it
    if (this.casesTable) {
      this.casesTable.reset();
      this.casesTable.filter(this.selectedStatusFilter, 'Status', 'in');
    }

    this.togglingOpenCases = false;
  }

  private showSuccess(heading: string, message: string) {
    this.toasterService.pop('success', heading, message);
  }

  private showError(heading: string, message: string) {
    this.toasterService.pop('error', heading, message);
  }

  get service() {
    return this.newCaseForm.get('service');
  }

  get severity() {
    return this.newCaseForm.get('severity');
  }

  get users_impacted() {
    return this.newCaseForm.get('users_impacted');
  }

  get site() {
    return this.newCaseForm.get('site');
  }

  get subject() {
    return this.newCaseForm.get('subject');
  }

  get description() {
    return this.newCaseForm.get('description');
  }

  get comment() {
    return this.newCommentForm.get('comment');
  }
}
