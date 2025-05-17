import { TimeCircleApi } from "@/components/visualization/time-circle/time-circle";
import { getFallbackPicture } from "@/lib/user-utils";
import { getProfile } from "@/services/methods/user/profile";
import { create } from "zustand";

export type ViewsState = {
  timeCircleView: TimeCircleApi | undefined;
  setTimeCircleView: (api: TimeCircleApi) => void;
};

export const useViewsStore = create<ViewsState>()((set, get) => ({
  timeCircleView: undefined,
  setTimeCircleView(api) {
    set({ timeCircleView: api });
  },
}));
