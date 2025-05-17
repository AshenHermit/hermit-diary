export type User = {
  id: number;
  email: string;
  password: string;
  name: string;
  service: "email" | "google" | "vk" | "yandex" | "github";
  picture: string;
  birthday: string | null;
};

export type SocialLink = {
  id: number;
  url: string;
  title: string;
  description: string;
};
