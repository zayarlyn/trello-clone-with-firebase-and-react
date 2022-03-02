import { useState } from "react";
import { createPortal } from "react-dom";
import ListHeader from "./ListHeader";
import Note from "./Note";
import ListFooter from "./ListFooter";
import ListDropDown from "./ListDropDown";
import Backdrop from "../modal/Backdrop";

function List({ data, listIdx, addNote, deleteNote }) {
  const [dropDownOn, setDropDownOn] = useState(false);

  return (
    <li className="min-w-[20rem] w-64 border-2 border-orange-500">
      <div className="relative bg-list-clr rounded-md p-2 shadow-sm">
        <ListHeader hdr={data.title} setDropDownOn={setDropDownOn} />
        {dropDownOn && (
          <>
            {createPortal(<Backdrop onClick={() => setDropDownOn(false)} />, document.getElementById("backdrop"))}
            <ListDropDown />
          </>
        )}
        <ul>
          {/* {data.notes.map((note, i) => (
            <Note
              key={note.txt}
              note={note.txt}
              deleteNote={() => deleteNote(listIdx, i)}
            />
          ))} */}
        </ul>
        <ListFooter listIdx={listIdx} addNote={addNote} />
      </div>
    </li>
  );
}

export default List;
