interface OfficialPayload {
  name: string;
  biography?: string;
  position: string;
}

export type CreateOfficailRequest = OfficialPayload;