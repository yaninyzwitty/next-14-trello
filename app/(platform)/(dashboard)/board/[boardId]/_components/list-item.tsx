"use client";

import {ListWithCards} from "@/types";
import ListHeader from "./list-header";
import {ElementRef, useRef, useState} from "react";
import CardForm from "./card-form";
import {cn} from "@/lib/utils";
import CardItem from "./card-item";
import {Draggable, Droppable} from "@hello-pangea/dnd";

type Props = {
  index: number;
  data: ListWithCards;
};

function ListItem({index, data}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const textAreaRef = useRef<ElementRef<"textarea">>(null);

  const disableEditng = () => {
    setIsEditing(false);
  };
  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => textAreaRef.current?.focus());
  };
  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="shrink-0 h-full w-[272px] select-none"
        >
          <div
            className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2"
            {...provided.dragHandleProps}
          >
            <ListHeader onAddCard={enableEditing} data={data} />
            <Droppable droppableId={data.id} type="card">
              {(provided) => (
                <ol
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={cn(
                    `mx-1 px-1 py-0.5 flex flex-col gap-y-2 `,
                    data.cards.length > 0 ? "mt-2" : "mt-0"
                  )}
                >
                  {data.cards.map((card, idx) => (
                    <CardItem index={idx} key={card.id} data={card} />
                  ))}
                </ol>
              )}
            </Droppable>
            <CardForm
              ref={textAreaRef}
              isEditing={isEditing}
              enableEditing={enableEditing}
              disableEditing={disableEditng}
              listId={data.id}
            />
          </div>
        </li>
      )}
    </Draggable>
  );
}

export default ListItem;
