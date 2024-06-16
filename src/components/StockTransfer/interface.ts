import type {
  PaginatedRR,
  PaginatedWarehouse,
  ReceivingReport,
  Warehouse,
} from "../../interface";

export interface STFormDetailsProps {
  openEdit: boolean;
  selectedRow: any;
  status: string;
  setStatus: (status: string) => void;
  transactionDate: string;
  setTransactionDate: (transactionDate: string) => void;
  remarks: string;
  setRemarks: (remarks: string) => void;
  rrTransfer: string;
  setRRTransfer: (rrTransfer: string) => void;
  warehouses: PaginatedWarehouse;
  selectedWarehouse: Warehouse | null;
  setSelectedWarehouse: (warehouse: Warehouse | null) => void;
  receivingReports: PaginatedRR;
  selectedRR: ReceivingReport | null;
  setSelectedRR: (receivingReport: ReceivingReport | null) => void;
}
