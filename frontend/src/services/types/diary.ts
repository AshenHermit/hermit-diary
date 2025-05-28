import { RichContentData } from "@/services/types/notes";
import { GlobalUser } from "@/services/types/user";

export type Diary = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  picture: string;
  isPublic: boolean;
  user: GlobalUser;
  description: RichContentData | null;
  properties?: DiaryProperties;
};

export type DiaryProperties = {
  accentColor?: string;
  backgroundImage?: string;
  coverImage?: string;
  showUserAge?: boolean;
};

export const defaultDiaryProperties: DiaryProperties = {
  accentColor: "#ffac59",
  backgroundImage: "/textures/bg.png",
  showUserAge: false,
};
