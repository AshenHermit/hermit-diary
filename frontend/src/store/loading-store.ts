import { TimeCircleApi } from "@/components/visualization/time-circle/time-circle";
import { getFallbackPicture } from "@/lib/user-utils";
import { getProfile } from "@/services/methods/user/profile";
import { create } from "zustand";

type TaskID = string;

export type LoadingState = {
  isLoading: boolean;
  tasks: Set<TaskID>;
  startTask: (key: TaskID) => void;
  endTask: (key: TaskID) => void;
};

export const useLoadingStore = create<LoadingState>()((set, get) => ({
  isLoading: false,
  tasks: new Set(),
  startTask: (id) => {
    const tasks = get().tasks;
    tasks.add(id);
    set({ isLoading: tasks.size > 0 });
  },
  endTask: (id) => {
    const tasks = get().tasks;
    tasks.delete(id);
    set({ isLoading: tasks.size > 0 });
  },
}));

export function useLoadingManager() {
  const startTask = useLoadingStore((state) => state.startTask);
  const endTask = useLoadingStore((state) => state.endTask);
  return { startTask, endTask };
}
