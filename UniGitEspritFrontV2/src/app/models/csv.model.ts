export interface CsvError {
  line: number;
  message: string;
}

export interface CsvImportReport {
  successCount: number;
  totalProcessed: number;
  errors: CsvError[];
}