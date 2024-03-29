
export class Tender {
  Artificial: boolean;
  ContractStatusCommentId: number;
  ContractStatusCommentName: string;
  ContractStatusId: number;
  ContractStatusName: string;
  CreatedBy: number;
  CreatedOn: string;
  DateOfTender: string;
  DeadlineForSupply: string;
  FederalDistrictId: number;
  FederalDistrictName: string;
  FederalLawId: number;
  FederalLawNumber: number;
  GosZakupkiLink: string;
  HospitalINN: string;
  HospitalId: string;
  ClientId: string;
  HospitalName: string;
  Id: number;
  StartingPrice: number;
  TenderVolume: number;
  IndicationId: number;
  IndicationName: string;
  LegalEntityTypeId: number;
  LegalEntityTypeName: string;
  ModifiedBy: number;
  ModifiedOn: string;
  NotificationNumber: string;
  OwnerId: number;
  RegionId: number;
  RegionName: string;
  SourceOfFinId: number;
  SourceOfFinName: string;
  StatusChangedOn: string;
  SupplierId: number;
  SupplierName: string;
  TAMName: string;
  TenderStatusCommentId: number;
  TenderStatusCommentName: string;
  TenderStatusId: number;
  LegalEntityType: string;
  TenderStatusName: string;
  TenderWinnerId: number;
  TenderWinnerName: string;
  ContractQuantity: number;
  VersionNumber: string;
  WonContractPriceRUB: number;
}

export enum ActionsTender {
  save = 'Save Tender',
  decline = 'Decline Tender',
  create = 'Create Case',
  planned = 'Planned',
  announced = 'Announced',
  copy = 'Copy',
}

export interface ActionTenderEvent {
  action: string;
  tender: Tender;
}
