export type Address = {
  id: string;
  hash: string;
  street1: string;
  street2?: string | null;
  city: string;
  state: string;
  zip: string;
};
