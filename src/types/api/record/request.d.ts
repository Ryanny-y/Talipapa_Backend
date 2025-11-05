interface RecordPayload {
  firstName: string;
  lastName: string;
  middleName: string;
  suffix?: string;
  birthDate?: string;
  age: number;
  gender: string;
  isResident?: boolean;
  address?: string;
  contactNumber?: string;
  points?: number;
}

export interface SearchRecordQuery {
  query?: string;
  residentStatus?: string;
  page?: string;
  limit?: string;
}

export type CreateRecordRequest = RecordPayload;
export type UpdateRecordRequest = Partial<RecordPayload>;

