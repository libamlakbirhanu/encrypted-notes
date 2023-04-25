import { Content } from "@tiptap/react";

export type Note = {
  id: string;
  title: string;
  content: Content;
  updatedAt: Date;
};

export type userDataType = { username: string; passphrase: string };
