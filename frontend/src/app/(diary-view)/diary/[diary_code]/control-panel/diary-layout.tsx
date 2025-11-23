"use client";

import {
  ArtefactBadge,
  ArtefactsPanel,
} from "@/app/(diary-view)/diary/[diary_code]/control-panel/artefacts-panel";
import { InfoPanel } from "@/app/(diary-view)/diary/[diary_code]/control-panel/info-panel";
import { NotesManager } from "@/app/(diary-view)/diary/[diary_code]/control-panel/notes-manager";
import { SelectedNotePanel } from "@/app/(diary-view)/diary/[diary_code]/control-panel/selected-note-panel";
import { SettingsPanel } from "@/app/(diary-view)/diary/[diary_code]/control-panel/settings-panel";
import {
  useDiaryNote,
  useDiaryStore,
} from "@/app/(diary-view)/diary/[diary_code]/diary-store";
import { DiaryStylesApplier } from "@/components/controls/diary-styles-applier";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { decodeId, encodeId } from "@/lib/hash-utils";
import { useUserStore } from "@/store/user-store";
import classNames from "classnames";
import {
  CassetteTapeIcon,
  CircleDotDashedIcon,
  ClockFadingIcon,
  ClockIcon,
  EllipsisVerticalIcon,
  FolderTreeIcon,
  InfoIcon,
  PanelLeftIcon,
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
    side: "left",
  },
  {
    key: "tree",
    name: "tree",
    icon: FolderTreeIcon,
    writePermission: false,
    content: NotesManager,
    side: "left",
  },
  {
    key: "artefacts",
    name: "artefacts",
    icon: CassetteTapeIcon,
    writePermission: false,
    content: ArtefactsPanel,
    badgesComponent: ArtefactBadge,
    side: "right",
  },
  {
    key: "settings",
    name: "settings",
    icon: SettingsIcon,
    writePermission: true,
    content: SettingsPanel,
    side: "left",
  },
  {
    key: "info",
    name: "info",
    icon: InfoIcon,
    content: InfoPanel,
    writePermission: false,
    side: "left",
  },
] as const;

export type TabKey = (typeof tabsRaw)[number]["key"];
export type TabData = {
  key: TabKey;
  name: string;
  icon: (typeof tabsRaw)[0]["icon"];
  writePermission: boolean;
  content: React.FunctionComponent;
  badgesComponent?: React.FunctionComponent;
  side: "left" | "right";
};
const tabs: TabData[] = tabsRaw as any;

function isTabsKey(value: string): value is TabKey {
  return tabs.some((tab) => tab.key === value);
}

export type ViewKey = "graph" | "time";

export function DiaryLayout({ children }: React.PropsWithChildren) {
  const params = useParams<{ diary_code: string }>();
  const loadDiary = useDiaryStore((state) => state.loadDiary);

  const properties = useDiaryStore((state) => state.properties);

  const writePermission = useDiaryStore((state) => state.writePermission);
  const availableTabs = tabs.filter(
    (x) => (x.writePermission && writePermission) || !x.writePermission,
  );
  const isMobile = useIsMobile();

  const currentView = useDiaryStore((state) => state.currentView);
  const setCurrentView = useDiaryStore((state) => state.setCurrentView);

  React.useEffect(() => {
    loadDiary(decodeId("diary", params.diary_code));
  }, [params.diary_code]);

  return (
    <>
      <DiaryStylesApplier properties={properties} />
      <Suspense>
        <SelectedNoteLoader />
        <TabSelector />
        <SearchParamsSetter />
      </Suspense>

      <div className="grid h-full overflow-x-hidden max-md:grid-rows-[1fr_auto] md:grid-cols-[auto_1fr_auto]">
        <TabsContainer
          className="max-md:order-2"
          side="left"
          tabs={availableTabs.filter((tab) => tab.side != "right" || isMobile)}
          sideButtonsContent={
            <Tabs
              className="select-none"
              value={currentView}
              onValueChange={(value) => setCurrentView(value as ViewKey)}
            >
              <TabsList>
                <TabsTrigger value="graph" className="gap-2">
                  <GraphIcon /> Graph
                </TabsTrigger>
                <TabsTrigger value="time" className="gap-2">
                  <ClockFadingIcon /> Time
                </TabsTrigger>
              </TabsList>
            </Tabs>
          }
        />
        <div className="max-md:order-1 max-md:h-full">{children}</div>
        {!isMobile ? (
          <TabsContainer
            side="right"
            initOpen={false}
            tabs={availableTabs.filter((tab) => tab.side == "right")}
          />
        ) : null}
      </div>
    </>
  );
}

function GraphIcon({ className }: { className?: string }) {
  return (
    <svg
      className={classNames(className, "lucide rotate-12")}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
    </svg>
  );
}

function TabsContainer({
  tabs,
  sideButtonsContent,
  initOpen = true,
  side,
  className,
}: {
  tabs: TabData[];
  side: "left" | "right";
  className?: string;
  sideButtonsContent?: React.ReactElement;
  initOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = React.useState(initOpen);
  const [width, setWidth] = React.useState(500);
  const resizeButtonRef = React.useRef<HTMLDivElement>(null);
  const currentFocusTab = useDiaryStore((state) => state.currentTab);
  const setCurrentFocusTab = useDiaryStore((state) => state.setCurrentTab);

  const [selectedTab, setSelectedTab] = React.useState(
    tabs ? tabs[0].key : null,
  );

  let selectedTabData: TabData | null = null;
  const availableCurrentTabs = tabs.filter((tab) => tab.key == selectedTab);
  if (availableCurrentTabs.length > 0)
    selectedTabData = availableCurrentTabs[0];

  const setTab = React.useCallback((key: TabKey) => {
    setCurrentFocusTab(key);
    setIsOpen(true);
  }, []);

  React.useEffect(() => {
    const currentTabSearch = tabs.filter((tab) => tab.key == currentFocusTab);
    if (currentTabSearch.length > 0) {
      setSelectedTab(currentTabSearch[0].key);
      setIsOpen(true);
    }
  }, [currentFocusTab, tabs]);

  React.useEffect(() => {
    const state = { isResizing: false, width: width };
    function onMouseDown(e: MouseEvent) {
      state.isResizing = true;
    }
    function onMouseUp(e: MouseEvent) {
      state.isResizing = false;
    }
    function onMouseMove(e: MouseEvent) {
      if (state.isResizing) {
        state.width += e.movementX * (side == "right" ? -1 : 1);
        setWidth(state.width);
      }
    }

    if (resizeButtonRef.current) {
      resizeButtonRef.current.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mouseup", onMouseUp);
      window.addEventListener("mousemove", onMouseMove);
      return () => {
        resizeButtonRef.current?.removeEventListener("mousedown", onMouseDown);
        window.removeEventListener("mouseup", onMouseUp);
        window.removeEventListener("mousemove", onMouseMove);
      };
    }
  }, []);

  const isMobile = useIsMobile();

  return (
    <div
      className={classNames(
        "flex max-h-full min-h-0 max-md:flex-col max-md:justify-stretch",
        {
          "flex-row-reverse": side == "right",
        },
        className,
      )}
    >
      <div className="flex flex-row bg-sidebar max-md:z-40 max-md:order-3 max-md:justify-center md:w-fit md:flex-col">
        {tabs.map((tab) => (
          <div key={tab.key} className="z-20 w-[3.5rem]">
            <TabButton
              onClick={() => setTab(tab.key)}
              active={selectedTab == tab.key}
              tab={tab}
              side={side}
            >
              {tab.badgesComponent && <tab.badgesComponent />}
            </TabButton>
          </div>
        ))}
      </div>
      <main
        className={classNames(
          "grid max-md:order-2 max-md:grid-cols-1 max-md:grid-rows-[auto_1fr] md:grid-cols-[auto_1fr]",
          { "max-md:!h-[50vh]": isOpen },
        )}
      >
        <div
          className={classNames(
            "overflow-x-hidden bg-background transition-all max-md:order-2",
            {
              "h-full": isOpen,
              "h-0": !isOpen,
              "order-2": side == "right",
            },
          )}
          style={
            !isMobile ? { width: isOpen ? `${width}px` : "0px" } : undefined
          }
        >
          {tabs.map((tab) => (
            <div
              key={tab.key + "content"}
              className={classNames(
                "h-0 min-h-full max-w-[100vw] overflow-y-auto",
                {
                  "sr-only hidden": selectedTabData?.key != tab.key || !isOpen,
                },
              )}
            >
              <div className="mb-2 grid min-h-full">
                <tab.content />
              </div>
            </div>
          ))}
        </div>
        <div
          className={classNames("pointer-events-none relative max-md:order-1", {
            "order-1": side == "right",
          })}
        >
          <div
            className={classNames(
              "absolute z-10 flex h-full gap-4 max-md:bottom-0 max-md:h-fit md:top-0",
              {
                "right-0 flex-row-reverse": side == "right",
                "left-0": side != "right",
              },
            )}
          >
            <div
              className={classNames(
                "flex h-full flex-col justify-center border-black max-md:hidden",
                {
                  "-ml-6 border-r-8": side == "right",
                  "-mr-6 border-l-8": side != "right",
                  hidden: !isOpen,
                },
              )}
            >
              <div
                ref={resizeButtonRef}
                className={classNames(
                  "pointer-events-auto cursor-e-resize select-none rounded-lg bg-black p-2",
                  {
                    "-mr-4": side == "right",
                    "-ml-4": side != "right",
                  },
                )}
              >
                <EllipsisVerticalIcon size={16} />
              </div>
            </div>
            <Button
              variant={"ghost"}
              className="pointer-events-auto h-10 w-10 p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {side == "left" ? <PanelLeftIcon /> : <PanelRightIcon />}
            </Button>
            <div className="pointer-events-auto h-fit">
              {sideButtonsContent}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function TabButton({
  tab,
  active,
  side,
  children,
  ...props
}: React.ComponentProps<typeof Button> & {
  tab: TabData;
  active?: boolean;
  side: "left" | "right";
}) {
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
        "!relative z-10 h-[3.5rem] max-w-[3.5rem] flex-row-reverse justify-start gap-4 p-4 transition-all",
        { "hover:max-w-48 hover:rounded-md": canUnfold },
        { "max-md:rounded-t-none md:rounded-e-none": active },
        { "bg-background hover:!bg-background": active },
        { "!float-right flex-row": side == "right" },
      )}
    >
      {children ? (
        <div
          className={classNames(
            "absolute top-0 flex justify-center gap-2 max-md:w-full max-md:flex-row md:h-full md:flex-col",
            {
              "md:left-0": side == "right",
              "max-md:left-0 md:right-0": side != "right",
            },
          )}
        >
          {children}
        </div>
      ) : null}
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
