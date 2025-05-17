"use client";

import {
  FileType,
  FileUploader,
  UploadedFile,
} from "@/components/controls/file-uploader";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "@/components/ui/color-picker";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ValueScroller,
  ValueScrollerProps,
} from "@/components/ui/value-scroller";
import { useToast } from "@/hooks/use-toast";
import { PropertyValueType } from "@/services/types/properties";
import {
  BinaryIcon,
  CircleDashedIcon,
  CircleIcon,
  PaletteIcon,
  RulerDimensionLineIcon,
  XIcon,
} from "lucide-react";
import React from "react";

export type PropViewComponentProps<T> = {
  type: PropertyType<T>;
  value: T;
};

export type PropComponentProps<T> = {
  type: PropertyType<T>;
  value: T;
  onValueChange: (value: T) => void;
  readOnly: boolean;
};

export const NumberPropComponent: React.FC<PropComponentProps<number>> = ({
  type,
  value,
  onValueChange,
  readOnly,
}) => {
  const initValue = value === null ? 0 : value;
  return (
    <div>
      <Input
        disabled={readOnly}
        className="border-0 !outline-none ring-0"
        onChange={(e) => {
          onValueChange(Number(e.target.value));
        }}
        type="number"
        defaultValue={initValue}
      ></Input>
    </div>
  );
};

export const ColorPropComponent: React.FC<PropComponentProps<string>> = ({
  type,
  value,
  onValueChange,
  readOnly,
}) => {
  const [color, setColor] = React.useState(value === null ? "#fff" : value);
  return (
    <div>
      <ColorPicker
        disabled={readOnly}
        onChange={(v) => {
          setColor(v);
          onValueChange(v);
        }}
        value={color}
      />
    </div>
  );
};

export const CircleTypePropComponent: React.FC<PropComponentProps<string>> = ({
  type,
  value,
  onValueChange,
  readOnly,
}) => {
  const initValue = value === null ? "fill" : value;
  return (
    <div>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select circle type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="fill">
              <div className="flex items-center gap-2">
                <CircleIcon className="fill-foreground" />
                Fill
              </div>
            </SelectItem>
            <SelectItem value="hollow">
              <div className="flex items-center gap-2">
                <CircleIcon />
                Hollow
              </div>
            </SelectItem>
            <SelectItem value="dashed">
              <div className="flex items-center gap-2">
                <CircleDashedIcon />
                Dashed
              </div>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export const SliderPropComponent: React.FC<
  PropComponentProps<number> & ValueScrollerProps
> = ({ type, value, onValueChange, readOnly, ...props }) => {
  return (
    <div>
      {readOnly ? (
        <div>{value}</div>
      ) : (
        <ValueScroller value={value} onValueChange={onValueChange} {...props} />
      )}
    </div>
  );
};

export const ImagePropComponent: React.FC<
  PropComponentProps<string> & ValueScrollerProps
> = ({ type, value, onValueChange, readOnly, ...props }) => {
  const uploadRef = React.useRef<HTMLDivElement>(null);
  const [isLoadingImages, setIsLoadingImages] = React.useState(false);
  const { toast } = useToast();

  const onUpload = React.useCallback(
    async (files: UploadedFile[]) => {
      if (files.length > 0) {
        const file = files[0];
        onValueChange(file.url);
        toast({
          title: "Done!",
          description: "image uploaded",
          action: (
            <>
              <Avatar className="h-16 w-16">
                <AvatarImage src={file.url}></AvatarImage>
              </Avatar>
            </>
          ),
        });
      }
    },
    [toast],
  );

  return (
    <div>
      {readOnly ? (
        <Avatar className="h-32 w-32">
          <AvatarImage src={value}></AvatarImage>
        </Avatar>
      ) : (
        <div className="flex items-center justify-center" ref={uploadRef}>
          <FileUploader
            types={[FileType.Image]}
            onUpload={onUpload}
            areaRef={uploadRef}
            onLoadingStateChange={setIsLoadingImages}
          >
            <div className="flex flex-col items-center gap-2">
              <Avatar className="h-32 w-32">
                <AvatarImage src={value}></AvatarImage>
              </Avatar>
            </div>
          </FileUploader>
        </div>
      )}
    </div>
  );
};

export type PropertyType<T> = {
  key: string;
  icon: React.ReactElement;
  deserialize: (value: PropertyValueType) => T;
  serialize: (value: T) => PropertyValueType;
  component: React.FC<PropComponentProps<T>>;
};

export type OptionSchema<T> = {
  type: PropertyType<T>;
  key: string;
  title: string;
  description: string;
  props?: Record<string, any>;
  forceUpdate?: boolean;
  default?: T | (() => T);
};

export const PropTypes = {
  number: {
    key: "number",
    icon: <BinaryIcon />,
    deserialize: (value) => value as number,
    serialize: (value) => value as number,
    component: NumberPropComponent,
  } as PropertyType<number>,
  color: {
    key: "color",
    icon: <PaletteIcon />,
    deserialize: (value) => value as string,
    serialize: (value) => value as string,
    component: ColorPropComponent,
  } as PropertyType<string>,
  circleType: {
    key: "circleType",
    icon: <CircleIcon />,
    deserialize: (value) => value as string,
    serialize: (value) => value as string,
    component: CircleTypePropComponent,
  } as PropertyType<string>,
  numberSlider: {
    key: "numberSlider",
    icon: <RulerDimensionLineIcon />,
    deserialize: (value) => value as number,
    serialize: (value) => value as number,
    component: SliderPropComponent,
  } as PropertyType<number>,
  image: {
    key: "image",
    icon: <RulerDimensionLineIcon />,
    deserialize: (value) => value as string,
    serialize: (value) => value as string,
    component: ImagePropComponent,
  } as PropertyType<string>,
};

export const TestOptions = {
  test_number: {
    key: "test_number",
    description: "this is a test number",
    title: "Test Number",
    type: PropTypes.number,
  } as OptionSchema<number>,
};

export type PropertiesEditorProps = {
  options: Record<string, OptionSchema<any>>;
  value: Record<string, PropertyValueType>;
  onValueChange: (value: Record<string, PropertyValueType>) => void;
  editMode?: boolean;
  forceUpdate?: () => void;
};

export function PropertiesEditor({
  value: initValue,
  onValueChange,
  options,
  editMode,
  forceUpdate,
}: PropertiesEditorProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(initValue);

  const onOptionSelected = React.useCallback(
    (option: OptionSchema<any>) => {
      const newVal = {
        ...value,
        [option.key]:
          option.default === undefined
            ? undefined
            : typeof option.default === "function"
              ? option.default()
              : option.default,
      };
      setValue(newVal);
      onValueChange(newVal);
      if (forceUpdate) forceUpdate();
    },
    [value],
  );

  const onPropChange = React.useCallback(
    (key: string, val: PropertyValueType) => {
      const newVal = { ...value, [key]: val };
      setValue(newVal);
      onValueChange(newVal);
      if (options[key].forceUpdate) {
        if (forceUpdate) forceUpdate();
      }
    },
    [value, onValueChange],
  );

  const deleteProp = React.useCallback(
    (key: string) => {
      const newVal = { ...value };
      delete newVal[key];
      setValue(newVal);
      onValueChange({ ...newVal, [key]: null });
      if (forceUpdate) forceUpdate();
    },
    [value],
  );

  return (
    <div className="flex w-full flex-col gap-4">
      {Object.keys(value).map((key) => {
        if (!(key in options)) return null;
        const opt = options[key];
        const Component = opt.type.component;
        return (
          <div className="flex items-center gap-4">
            <div className="flex w-max items-center gap-2 whitespace-nowrap">
              {opt.type.icon}
              {opt.title}
            </div>
            <div className="flex w-full flex-col">
              <Component
                readOnly={!editMode}
                type={opt.type}
                value={value[key]}
                key={key}
                onValueChange={(val) => onPropChange(key, val)}
                {...opt.props}
              />
            </div>
            <div>
              <Button variant="ghost" onClick={() => deleteProp(key)}>
                <XIcon />
              </Button>
            </div>
          </div>
        );
      })}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button className="w-full text-2xl" variant={"outline"}>
            +
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Command>
            <CommandInput placeholder="Search props..." className="h-9" />
            <CommandList>
              <CommandEmpty>No props available</CommandEmpty>
              <CommandGroup>
                {Object.values(options).map((opt) => (
                  <CommandItem
                    key={opt.key}
                    value={opt.title + opt.description}
                    className="flex cursor-pointer gap-4"
                    onSelect={(value) => {
                      onOptionSelected(opt);
                      setOpen(false);
                    }}
                  >
                    {React.cloneElement(opt.type.icon, {
                      className: "!w-6 !h-6",
                    })}
                    <div className="flex flex-col">
                      <span>{opt.title}</span>
                      <span className="opacity-50">{opt.description}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
