export type Member = {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  active: boolean;
  userId: number | null;
  teamIds: number[];
};
