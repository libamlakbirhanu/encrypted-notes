import { useState } from "react";
import styles from "./Notes.module.css";
import { AES, enc } from "crypto-js";
import { v4 as uuid } from "uuid";
import { Note, userDataType } from "./types";
import NoteEditor from "./Components/NoteEditor";
import { JSONContent } from "@tiptap/react";
import storage from "./storage";
import debounce from "./debounce";

const STORAGE_KEY = "notes";

const saveNote = debounce(
  (note: Note, { username, passphrase }: userDataType) => {
    const noteIds = storage.get<string[]>(`${username}:${STORAGE_KEY}`, []);
    const noteIdsWithoutNote = noteIds.filter((id) => id !== note.id);
    storage.set(`${username}:${STORAGE_KEY}`, [...noteIdsWithoutNote, note.id]);

    const encryptedNote = AES.encrypt(
      JSON.stringify(note),
      passphrase
    ).toString();

    encryptedNote &&
      storage.set(`${username}:${STORAGE_KEY}:${note.id}`, encryptedNote);
  },
  500
);

const loadNotes = ({ username, passphrase }: userDataType) => {
  const noteIds = storage.get<string[]>(`${username}:${STORAGE_KEY}`, []);
  const notes: Array<Note | string> = [];

  noteIds.forEach((id) => {
    const encryptedNote = storage.get<string>(
      `${username}:${STORAGE_KEY}:${id}`
    );

    const note = AES.decrypt(encryptedNote, passphrase).toString(enc.Utf8);

    notes.push(JSON.parse(note));
  });

  return notes;
};

type Props = {
  userData: userDataType;
};

function Notes({ userData }: Props) {
  const [notes, setNotes] = useState<(Note | any)[]>([...loadNotes(userData)]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>();

  const handleChangeNoteContent = (
    noteId: string | undefined,
    content: JSONContent,
    title = "New Note"
  ) => {
    setNotes((prev) => {
      const data = [...prev];

      return [
        ...data.map((item) => {
          if (item.id === noteId) {
            item.content = content;
            item.updatedAt = new Date();
            item.title = title;

            saveNote(item, userData);
          }
          return item;
        }),
      ];
    });
  };

  const handleActiveNote = (id: string) => {
    setActiveNoteId(id);
  };

  let activeNote = activeNoteId
    ? notes.filter((note) => note.id === activeNoteId)[0]
    : null;

  const handleCreateNewNote = () => {
    const newNote = {
      id: uuid(),
      title: "new note",
      content: `<h1>New note</h1>`,
      updatedAt: new Date(),
    };

    setNotes((prev) => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
    saveNote(newNote, userData);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.sidebar}>
        <button className={styles.sidebarButton} onClick={handleCreateNewNote}>
          New note
        </button>
        <div className={styles.sidebarList}>
          {notes.map((note) => (
            <div
              key={note.id}
              role="button"
              tabIndex={0}
              className={
                note.id === activeNoteId
                  ? styles.sidebarItemActive
                  : styles.sidebarItem
              }
              onClick={() => handleActiveNote(note.id)}
            >
              {note.title}
            </div>
          ))}
        </div>
      </div>
      {activeNote ? (
        <NoteEditor
          note={activeNote}
          onChange={(content, title) => {
            handleChangeNoteContent(activeNote?.id, content, title);
          }}
        />
      ) : (
        <div>Create a new note</div>
      )}
    </div>
  );
}

export default Notes;
