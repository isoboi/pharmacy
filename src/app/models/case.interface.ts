export interface TenderCase {
  CPStatus: boolean;
  ChildId: number;
  CreatedBy: number;
  CreatedOn: string;
  DiscountNumber: number;
  DiscountProvided: boolean;
  DiscountValidityDate: string;
  DupStatus: boolean;
  FederalLawNumber: number;
  HospitalName: number;
  Id: number;
  ModifiedBy: number;
  ModifiedOn: string;
  NotificationNumber: number;
  OwnerId: number;
  ParentId: number;
  RegionName: string;
  RelatedCaseCommentId: number;
  RelatedCaseCommentName: string;
  SalesChannelId: string;
  SalesChannelName: string;
  SourceOfFinName: string;
  SupplierId: number;
  SupplierName: string;
  TAMName: string;
  TenderCaseStatusId: number;
  TenderId: number;
  VersionNumber: string;
  WeightedAveConractPriceRUB: string;
}

export enum Actions {
  save = 'Save Case',
  approversRequests = 'Approver\'s requests',
  approve = 'Approve',
  reject = 'Reject',
  draft = 'Draft'
}

export interface ActionEvent {
  action: string;
  tenderCase: TenderCase;
}

export enum TenderCaseStatus {
  reject = 11,
  draft = 1
}
