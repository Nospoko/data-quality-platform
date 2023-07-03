export type UserData = {
  firstName: string;
  lastName: string;
  email: string;
  image: string;
};

export type IFile = {
  id: string;
  name: string;
  duration: number;
  userId: string;
  link: string;
};

export type IFilesResponse = {
  code: number;
  data: IFile[];
};
