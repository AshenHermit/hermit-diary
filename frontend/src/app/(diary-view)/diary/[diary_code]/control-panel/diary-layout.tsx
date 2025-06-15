"use client";

import { InfoPanel } from "@/app/(diary-view)/diary/[diary_code]/control-panel/info-panel";
import { NotesManager } from "@/app/(diary-view)/diary/[diary_code]/control-panel/notes-manager";
import { SelectedNotePanel } from "@/app/(diary-view)/diary/[diary_code]/control-panel/selected-note-panel";
import { SettingsPanel } from "@/app/(diary-view)/diary/[diary_code]/control-panel/settings-panel";
import { useDiaryStore } from "@/app/(diary-view)/diary/[diary_code]/diary-store";
import { DiaryStylesApplier } from "@/components/controls/diary-styles-applier";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { decodeId, encodeId } from "@/lib/hash-utils";
import { useUserStore } from "@/store/user-store";
import classNames from "classnames";
import {
  CircleDotDashedIcon,
  FolderTreeIcon,
  InfoIcon,
  PanelRightIcon,
  SettingsIcon,
} from "lucide-react";
import Link from "next/link";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React, { Suspense } from "react";

const tabsRaw = [
  {
    key: "note",
    name: "note",
    icon: CircleDotDashedIcon,
    writePermission: false,
    content: SelectedNotePanel,
  },
  {
    key: "tree",
    name: "tree",
    icon: FolderTreeIcon,
    writePermission: false,
    content: NotesManager,
  },
  {
    key: "settings",
    name: "settings",
    icon: SettingsIcon,
    writePermission: true,
    content: SettingsPanel,
  },
  {
    key: "info",
    name: "info",
    icon: InfoIcon,
    content: InfoPanel,
  },
] as const;

export type TabKey = (typeof tabsRaw)[number]["key"];
export type TabData = {
  key: TabKey;
  name: string;
  icon: (typeof tabsRaw)[0]["icon"];
  writePermission: boolean;
  content: React.FunctionComponent;
};
const tabs: TabData[] = tabsRaw as any;

function isTabsKey(value: string): value is TabKey {
  return tabs.some((tab) => tab.key === value);
}

export type ViewKey = "graph" | "time";

export function DiaryLayout({ children }: React.PropsWithChildren) {
  const [isOpen, setIsOpen] = React.useState(true);
  const params = useParams<{ diary_code: string }>();
  const loadDiary = useDiaryStore((state) => state.loadDiary);
  const writePermission = useDiaryStore((state) => state.writePermission);

  const currentTab = useDiaryStore((state) => state.currentTab);
  const setCurrentTab = useDiaryStore((state) => state.setCurrentTab);

  const currentView = useDiaryStore((state) => state.currentView);
  const setCurrentView = useDiaryStore((state) => state.setCurrentView);

  const properties = useDiaryStore((state) => state.properties);

  let selectedTabData: TabData | null = null;
  const availableCurrentTabs = tabs.filter((tab) => tab.key == currentTab);
  if (availableCurrentTabs.length > 0)
    selectedTabData = availableCurrentTabs[0];

  const setTab = React.useCallback((key: TabKey) => {
    setCurrentTab(key);
    setIsOpen(true);
  }, []);

  React.useEffect(() => {
    setIsOpen(true);
  }, [currentTab]);

  React.useEffect(() => {
    loadDiary(decodeId("diary", params.diary_code));
  }, [params.diary_code]);

  const availableTabs = tabs.filter(
    (x) => (x.writePermission && writePermission) || !x.writePermission,
  );

  return (
    <div className="grid h-full max-md:grid-rows-[1fr_auto_auto] md:grid-cols-[auto_auto_1fr]">
      <DiaryStylesApplier properties={properties} />
      <Suspense>
        <SelectedNoteLoader />
        <TabSelector />
        <SearchParamsSetter />
      </Suspense>
      <div className="flex flex-row bg-sidebar max-md:z-40 max-md:order-3 max-md:justify-center md:w-fit md:flex-col">
        {availableTabs.map((tab) => (
          <div key={tab.key} className="w-[3.5rem]">
            <TabButton
              onClick={() => setTab(tab.key)}
              active={currentTab == tab.key}
              tab={tab}
              key={tab.key}
            />
          </div>
        ))}
      </div>
      <main
        className={classNames(
          "grid h-0 min-h-full max-md:order-2 max-md:grid-cols-1 max-md:grid-rows-[auto_1fr] md:grid-cols-[auto_1fr]",
          { "max-md:!h-[50vh]": isOpen },
        )}
      >
        <div
          className={classNames(
            "overflow-x-hidden bg-background transition-all max-md:order-2",
            {
              "h-[full] md:w-[500px]": isOpen,
              "h-0 w-0": !isOpen,
            },
          )}
        >
          {availableTabs.map((tab) => (
            <div
              key={tab.key}
              className={classNames("h-full max-w-[100vw] overflow-y-auto", {
                "sr-only hidden": selectedTabData?.key != tab.key || !isOpen,
              })}
            >
              <div className="mb-2 grid min-h-full">
                <tab.content />
              </div>
            </div>
          ))}
        </div>
        <div className="relative max-md:order-1">
          <div className="absolute left-0 z-10 flex gap-4 max-md:bottom-0 md:top-0">
            <Button
              variant={"ghost"}
              className="h-10 w-10 p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              <PanelRightIcon />
            </Button>
            <Tabs
              className="select-none"
              value={currentView}
              onValueChange={(value) => setCurrentView(value as ViewKey)}
            >
              <TabsList>
                <TabsTrigger value="graph">Graph</TabsTrigger>
                <TabsTrigger value="time">Time</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </main>
      <div className="max-md:order-1 max-md:h-full">{children}</div>
    </div>
  );
}

function TabButton({
  tab,
  active,
  ...props
}: React.ComponentProps<typeof Button> & { tab: TabData; active?: boolean }) {
  const [canUnfold, setCanUnfold] = React.useState(true);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const onClick = React.useCallback<NonNullable<typeof props.onClick>>(
    (e) => {
      if (props.onClick) props.onClick(e);
      setCanUnfold(false);
    },
    [setCanUnfold],
  );

  React.useEffect(() => {
    if (!buttonRef.current) return;
    const handler = () => {
      setCanUnfold(true);
    };
    buttonRef.current.addEventListener("mouseleave", handler);
    return () => {
      if (!buttonRef.current) return;
      buttonRef.current.removeEventListener("mouseleave", handler);
    };
  }, []);

  return (
    <Button
      {...props}
      ref={buttonRef}
      onClick={onClick}
      variant="ghost"
      size={"lg"}
      className={classNames(
        "relative z-10 h-[3.5rem] max-w-[3.5rem] justify-start gap-4 overflow-hidden p-4 transition-all",
        { "hover:max-w-48 hover:rounded-md": canUnfold },
        { "max-md:rounded-t-none md:rounded-e-none": active },
        { "bg-background hover:!bg-background": active },
      )}
    >
      <tab.icon className="!size-6" />
      <span className="max-md:hidden">{tab.name}</span>
    </Button>
  );
}

const tabParamKey = "tab";

function TabSelector() {
  const setCurrentTab = useDiaryStore((state) => state.setCurrentTab);

  const tabParamKey = "tab";
  const searchParams = useSearchParams();

  const writePermission = useDiaryStore((state) => state.writePermission);
  const loaded = useDiaryStore((state) => state.loaded);
  const selectedTab = searchParams.get(tabParamKey);

  function getKeyForReset(): TabKey {
    return tabs.filter((tab) => !tab.writePermission)[0].key;
  }

  React.useEffect(() => {
    if (!loaded) return;
    if (selectedTab) {
      let newSelectedTabKey = getKeyForReset();
      if (isTabsKey(selectedTab)) {
        let selectedTabData = tabs.filter(
          (tab) => tab.key == newSelectedTabKey,
        )[0];
        if (!writePermission && selectedTabData.writePermission) {
        } else {
          newSelectedTabKey = selectedTab;
        }
      }
      console.log(newSelectedTabKey);
      setCurrentTab(newSelectedTabKey);
    }
  }, [selectedTab, setCurrentTab, writePermission]);

  return null;
}

const noteParamKey = "note";
const lastSelectedNoteStorageKey = "lastSelectedNote";

function SelectedNoteLoader() {
  const selectedNote = useDiaryStore((state) => state.selectedNote);
  const setSelectedNote = useDiaryStore((state) => state.setSelectedNote);
  const notes = useDiaryStore((state) => state.notes);
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const paramNoteCode = searchParams.get(noteParamKey);
    if (paramNoteCode) {
      const noteId = decodeId("note", paramNoteCode);
      if (noteId) {
        const noteSearch = notes.filter((x) => x.id == noteId);
        if (noteSearch.length > 0) {
          setSelectedNote(noteSearch[0]);
        }
      }
      return;
    }
    if (!selectedNote) {
      const lastNoteKey = localStorage.getItem(lastSelectedNoteStorageKey);
      if (lastNoteKey) {
        const noteSearch = notes.filter((x) => x.id == Number(lastNoteKey));
        if (noteSearch.length > 0) {
          setSelectedNote(noteSearch[0]);
        }
      }
    }
  }, [notes, searchParams]);

  return null;
}

function SearchParamsSetter() {
  const selectedNote = useDiaryStore((state) => state.selectedNote);
  const currentTab = useDiaryStore((state) => state.currentTab);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const loaded = useDiaryStore((state) => state.loaded);
  const router = useRouter();

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (loaded) {
      params.set(tabParamKey, currentTab);
      console.log(params.toString());
      router.replace(`${pathname}?${params.toString()}`);
    }

    if (selectedNote) {
      localStorage.setItem(
        lastSelectedNoteStorageKey,
        selectedNote.id.toString(),
      );
      params.set(noteParamKey, encodeId("note", selectedNote.id));
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [currentTab, loaded, selectedNote, searchParams]);

  return null;
}
