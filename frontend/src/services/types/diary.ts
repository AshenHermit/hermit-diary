export type Diary = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  picture: string;
  isPublic: boolean;
};

export type DiaryProperties = {
  accentColor?: string;
  backgroundImage?: string;
};

export const defaultDiaryProperties: DiaryProperties = {
  accentColor: "#ffac59",
  backgroundImage: "/textures/bg.png",
};
