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
  contact_number?: string;
  points?: number;
}

export type CreateRecordRequest = RecordPayload;
export type UpdateRecordRequest = Partial<RecordPayload>;