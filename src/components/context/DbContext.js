import { createContext, useContext, useState, useEffect, useReducer } from "react";
import {
  doc,
  collection,
  setDoc,
  getDocs,
  addDoc,
  onSnapshot,
  query,
  collectionGroup,
} from "@firebase/firestore";
import { db } from "../firebase-config";
import { useAuth } from "./AuthContext";
import { getAuth } from "@firebase/auth";

const dbContext = createContext();

export const useDB = () => {
  return useContext(dbContext);
};



export default function DbContext({ children }) {
  const [boards, setBoards] = useState([]);
  const [lists, setLists] = useState([]);
  const [notes, setNotes] = useState([]);

  const [currentBoard, setCurrentBoard] = useState("");

  const usersCol = collection(db, "users");
  const { currentUser } = useAuth();

  useEffect(() => {
    let unsubBoardListener, unsubListListener;
    if (currentUser) {
      unsubBoardListener = listenToBoardChange();
    }
    if (currentUser && currentBoard) {
      unsubListListener = listenToListChange();
    }
    return () => {
      unsubBoardListener?.();
      unsubListListener?.();
    };
  }, [currentUser, currentBoard]);

  const listenToBoardChange = () => {
    const q = collection(db, `users/${currentUser}/boards`);
    onSnapshot(q, (snapShot) => {
      setBoards(snapShot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
  };

  // console.log(boards);

  const listenToListChange = () => {
    const q = collection(
      db,
      `users/${currentUser}/boards/${currentBoard}/lists`
    );
    onSnapshot(q, (snapShot) => {
      setLists(snapShot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
  };

  const listenToNoteChange = () => {
    // const
    lists.forEach((list) => {
      const q = collection(
        db,
        `users/${currentUser}/boards/${currentBoard}/lists/notes`
      );
      onSnapshot(q, (snapShot) => {
        setLists(snapShot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      });
    });
  };

  const createProfile = (user) => {
    return setDoc(doc(usersCol, user), { title: user });
  };

  const getDocuments = async () => {
    const res = await getDocs(usersCol);
    return res;
    // return res.docs.map((doc) => doc.id);
  };

  const createBoard = (name) => {
    // setBoardName(name);

    const { currentUser } = getAuth();
    const userColRef = collection(
      db,
      `users/${currentUser.displayName}/${name}`
    );
    createList(userColRef, "test-list"); // sample list
  };

  const createList = (boardRef, listTitle) => {
    const docRef = doc(boardRef, listTitle);
    setDoc(docRef, { title: listTitle });
    createNote(docRef, "it worked!!!"); // sample note
  };

  const createNote = (boardRef, noteTxt) => {
    const NoteColRef = collection(boardRef, "notes");
    return addDoc(NoteColRef, {
      txt: noteTxt,
      someth: "random stuff",
    }); // auto generate id
  };

  const value = {
    createProfile,
    createBoard,
    getDocuments,
    listenToBoardChange,
    listenToListChange,
    lists,
    boards,
    setCurrentBoard,
    currentBoard
  };

  return <dbContext.Provider value={value}>{children}</dbContext.Provider>;
}

// const temp = {
//   user: {
//     board: {
//       list: {
//         title: "title",
//         notes: ["note1", "note2"],
//       },
//     },
//   },
// };
