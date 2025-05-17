"use client";

import { DiaryTabPanel } from "@/app/(diary-view)/diary/[diary_code]/control-panel/panel";
import { useDiaryStore } from "@/app/(diary-view)/diary/[diary_code]/diary-store";
import {
  ConfirmDialog,
  ConfirmDialogApi,
} from "@/components/controls/confirmation-dialog";
import {
  OptionSchema,
  PropertiesEditor,
  PropTypes,
  TestOptions,
} from "@/components/props-editor/props-editor";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { useRequestHandler } from "@/hooks/use-request-handler";
import { useToast } from "@/hooks/use-toast";
import {
  deleteDiary,
  updateDiary,
  updateDiaryProperties,
} from "@/services/methods/user/diaries";
import {
  defaultDiaryProperties,
  Diary,
  DiaryProperties,
} from "@/services/types/diary";
import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "just-debounce-it";
import { BoltIcon, CircleDashedIcon, TriangleAlertIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const sections = [
  {
    key: "general",
    title: (
      <>
        <CircleDashedIcon /> Основные
      </>
    ),
    content: <GeneralSettings />,
  },
  {
    key: "properties",
    title: (
      <>
        <BoltIcon /> Свойства
      </>
    ),
    content: <PropertiesSection />,
  },
  {
    key: "danger",
    title: (
      <>
        <TriangleAlertIcon /> Опасная зона
      </>
    ),
    content: <DangerZoneSection />,
  },
];

export function SettingsPanel() {
  return (
    <DiaryTabPanel>
      <div className="text-lg font-semibold">Настройки дневника</div>
      <Accordion type="multiple" defaultValue={["general"]}>
        {sections.map((x) => (
          <AccordionItem key={x.key} value={x.key}>
            <AccordionTrigger className="text-lg">{x.title}</AccordionTrigger>
            <AccordionContent>{x.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </DiaryTabPanel>
  );
}

const diaryGeneralSchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(50),
  isPublic: z.boolean(),
});
type DiaryGeneralInfer = z.infer<typeof diaryGeneralSchema>;

function GeneralSettings() {
  const { toast } = useToast();
  const diaryData = useDiaryStore((state) => state);

  const form = useForm<DiaryGeneralInfer>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(diaryGeneralSchema),
    defaultValues: diaryData,
  });

  const { loading, error, handleRequest } = useRequestHandler();

  const handleDebounceChange = React.useMemo(
    () =>
      debounce((data: DiaryGeneralInfer) => {
        const dataToUpdate = diaryGeneralSchema.parse(data);
        handleRequest(async () => {
          await updateDiary(dataToUpdate);
          toast({ title: "Saved!", description: "settings saved" });
        });
      }, 500),
    [],
  );

  const onChange = async () => {
    const data = form.getValues();
    handleDebounceChange(data);
  };

  return (
    <div className="flex flex-col gap-4 px-2">
      <Form {...form}>
        <form onChange={onChange} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Название</FormLabel>
                <FormControl>
                  <Input placeholder="название" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isPublic"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between gap-4">
                <FormLabel>Открытый доступ</FormLabel>
                <FormControl>
                  <Switch
                    className="!m-0"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <div className="flex flex-col gap-2"></div>
    </div>
  );
}

function DangerZoneSection() {
  const diaryData = useDiaryStore((state) => state);
  const loadDiary = useDiaryStore((state) => state.loadDiary);
  const [isOpen, setIsOpen] = React.useState(false);

  const router = useRouter();

  const deletionDialogApi = React.useRef<ConfirmDialogApi>(null);
  const { loading, error, handleRequest } = useRequestHandler();

  const onDelitionConfirm = React.useCallback(async () => {
    handleRequest(async () => {
      await deleteDiary(diaryData);
      setIsOpen(false);
      router.push("/profile/diaries");
    });
  }, [router, diaryData]);

  return (
    <>
      <ConfirmDialog
        apiRef={deletionDialogApi}
        onConfirm={onDelitionConfirm}
        title={"Удаление дневника"}
        description={"Безвозвратно"}
        okContent={"Удалить"}
        cancelContent={"Отмена"}
        danger
      />
      <Button
        variant={"destructive"}
        onClick={() => deletionDialogApi.current?.open()}
      >
        Delete Diary
      </Button>
    </>
  );
}

const DiaryPropsOptions: Record<keyof DiaryProperties, OptionSchema<any>> = {
  accentColor: {
    title: "Accent Color",
    description: "change accent color",
    key: "accentColor",
    type: PropTypes.color,
    default: defaultDiaryProperties.accentColor,
  },
  backgroundImage: {
    title: "Background Image",
    description: "upload custom bg image",
    key: "backgroundImage",
    type: PropTypes.image,
    default: defaultDiaryProperties.backgroundImage,
  },
};

function PropertiesSection() {
  const { toast } = useToast();
  const diaryId = useDiaryStore((state) => state.id);
  const properties = useDiaryStore((state) => state.properties);
  const loadProperties = useDiaryStore((state) => state.loadProperties);
  const writePermission = useDiaryStore((state) => state.writePermission);

  const { loading, error, handleRequest } = useRequestHandler();

  const saveProperties = React.useCallback(
    async (value: DiaryProperties) => {
      handleRequest(async () => {
        await updateDiaryProperties(diaryId, value);
        toast({ title: "Saved!", description: "settings saved" });
        await loadProperties();
      });
    },
    [diaryId],
  );

  const handleDebounceChange = React.useMemo(
    () => debounce(saveProperties, 500),
    [saveProperties],
  );

  return (
    <div>
      <PropertiesEditor
        onValueChange={handleDebounceChange}
        options={DiaryPropsOptions}
        value={properties}
        editMode={writePermission}
      />
    </div>
  );
}
