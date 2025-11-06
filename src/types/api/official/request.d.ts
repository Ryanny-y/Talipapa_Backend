interface OfficialPayload {
  name: string;
  biography?: string;
  position: string;
}

export type CreateOfficialRequest = OfficialPayload;
export type UpdateOfficiaiRequest = Partial<OfficialPayload>;