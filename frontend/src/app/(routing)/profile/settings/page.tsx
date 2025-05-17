"use client";

import {
  FileExtensions,
  FileType,
  FileUploader,
  UploadedFile,
} from "@/components/controls/file-uploader";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { HorizontalDivider } from "@/components/ui/horizontal-divider";
import { useToast } from "@/hooks/use-toast";
import { updateProfile } from "@/services/methods/user/profile";
import { useLocalUserPicture, useUserStore } from "@/store/user-store";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/spinner";
import { useRequestHandler } from "@/hooks/use-request-handler";
import { SocialLink } from "@/services/types/user";
import {
  addUserSocialLink,
  deleteSocialLink,
  getUserSocialLinks,
  updateUserSocialLink,
} from "@/services/methods/user/social-links";
import { CrossIcon, PencilIcon, PlusIcon, XIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Page() {
  const loaded = useUserStore((state) => state.loaded);

  return (
    <div className="flex flex-col gap-4 h-full p-8 pt-0">
      {loaded ? (
        <>
          <HorizontalDivider>Profile picture</HorizontalDivider>
          <ProfilePictureEditor />
          <HorizontalDivider>Info</HorizontalDivider>
          <div className="grid grid-cols-[1fr_1px_1fr] gap-4 h-full">
            <PersonalInfoEditor />
            <div className="bg-muted"></div>
            <SocialLinksEditor />
          </div>
        </>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}

function ProfilePictureEditor() {
  const picture = useLocalUserPicture();
  const loadUser = useUserStore((state) => state.loadUser);

  const uploadRef = React.useRef<HTMLDivElement>(null);
  const [isLoadingImages, setIsLoadingImages] = React.useState(false);
  const { toast } = useToast();

  const onUpload = React.useCallback(
    async (files: UploadedFile[]) => {
      if (files.length > 0) {
        const file = files[0];
        await updateProfile({ picture: file.url });
        loadUser();
        toast({
          title: "Done!",
          description: "profile pic changed",
          action: (
            <>
              <Avatar className="w-16 h-16">
                <AvatarImage src={file.url}></AvatarImage>
              </Avatar>
            </>
          ),
        });
      }
    },
    [toast]
  );

  return (
    <div className="flex items-center justify-center" ref={uploadRef}>
      <FileUploader
        types={[FileType.Image]}
        onUpload={onUpload}
        areaRef={uploadRef}
        onLoadingStateChange={setIsLoadingImages}
      >
        <div className="flex flex-col items-center gap-2">
          <Avatar className="w-32 h-32">
            <AvatarImage src={picture}></AvatarImage>
          </Avatar>
          <Button variant="default" className="-mt-8 z-10">
            edit
          </Button>
        </div>
      </FileUploader>
    </div>
  );
}

const personalInfoSchema = z.object({
  name: z.string().min(2).max(50),
  birthday: z.coerce.date(),
});

function PersonalInfoEditor() {
  const name = useUserStore((state) => state.name);
  const birthday = useUserStore((state) => state.birthday);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name,
      birthday: new Date(Date.parse(birthday ?? "1990-05-15")),
    },
  });

  const { loading, error, handleRequest } = useRequestHandler();

  function onSubmit(values: z.infer<typeof personalInfoSchema>) {
    handleRequest(async () => {
      const data = {
        name: values.name,
        birthday: values.birthday.toISOString().split("T")[0],
      };
      await updateProfile(data);
      toast({ title: "Done!", description: "profile info updated" });
    });
  }

  return (
    <div className="flex flex-col">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 items-start"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birthday"
            render={({ field }) => (
              <FormItem>
                <FormLabel>BirthDay</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    placeholder="birthday"
                    {...field}
                    value={
                      field.value instanceof Date
                        ? field.value.toISOString().split("T")[0]
                        : field.value
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">
            {loading ? <LoadingSpinner className="text-black" /> : "Save"}{" "}
          </Button>
        </form>
      </Form>
    </div>
  );
}

function SocialLinksEditor() {
  const id = useUserStore((state) => state.id);
  const [links, setLinks] = React.useState<SocialLink[]>([]);

  const loadLinks = React.useCallback(async () => {
    let fetchedLinks = await getUserSocialLinks(id);
    setLinks(fetchedLinks);
  }, [id]);

  const addLink = React.useCallback(async () => {
    let fetchedLinks = await addUserSocialLink(id);
    loadLinks();
  }, [id]);

  React.useEffect(() => {
    loadLinks();
  }, [loadLinks]);

  return (
    <div className="flex flex-col gap-2">
      <div>Social links</div>
      {links.map((link) => (
        <SocialLinkEditItem
          onUpdate={loadLinks}
          key={link.id}
          userId={id}
          socialLink={link}
        />
      ))}
      <div className="flex justify-center">
        <Button onClick={addLink}>
          <PlusIcon /> Add
        </Button>
      </div>
    </div>
  );
}

const socialLinkUpdateSchema = z.object({
  title: z.string().min(1).max(50),
  description: z.string(),
  url: z.string().url(),
});

function SocialLinkEditItem({
  userId,
  socialLink,
  onUpdate,
}: {
  userId: number;
  socialLink: SocialLink;
  onUpdate?: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const form = useForm<z.infer<typeof socialLinkUpdateSchema>>({
    resolver: zodResolver(socialLinkUpdateSchema),
    defaultValues: socialLink,
  });

  const { loading, error, handleRequest } = useRequestHandler();
  const { toast } = useToast();

  const onSubmit = React.useCallback(
    async (values: z.infer<typeof socialLinkUpdateSchema>) => {
      await handleRequest(async () => {
        let data: SocialLink = {
          id: socialLink.id,
          ...values,
        };
        await updateUserSocialLink(userId, data);
        toast({ title: "Done!", description: "social link updated" });
        setOpen(false);
        if (onUpdate) onUpdate();
      });
    },
    [userId, socialLink]
  );

  const deleteLink = React.useCallback(async () => {
    await handleRequest(async () => {
      await deleteSocialLink(userId, socialLink);
      toast({ title: "Deleted", description: "social link deleted" });
      if (onUpdate) onUpdate();
    });
  }, [userId, socialLink]);

  return (
    <>
      <div className="p-2 border-2 rounded-lg grid grid-cols-[38px_1fr_38px] items-center gap-4">
        <Button onClick={() => setOpen(true)} className="aspect-square px-0">
          <PencilIcon />
        </Button>
        <div>{socialLink.title}</div>
        <Button onClick={deleteLink} className="aspect-square px-0">
          <XIcon />
        </Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit social link</DialogTitle>
          </DialogHeader>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>title</FormLabel>
                      <FormControl>
                        <Input placeholder="title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>url</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="url" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>description</FormLabel>
                      <FormControl>
                        <Input placeholder="description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">
                  {loading ? <LoadingSpinner /> : "Save"}
                </Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
