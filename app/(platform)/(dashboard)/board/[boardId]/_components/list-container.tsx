"use client";

import {ListWithCards} from "@/types";
import {useEffect, useState} from "react";
import ListForm from "./list-form";
import ListItem from "./list-item";
import {DragDropContext, Droppable} from "@hello-pangea/dnd";
import {useAction} from "@/hooks/use-action";
import {updateListOrder} from "@/action/update-list-order";
import {updateCardOrder} from "@/action/update-card-order";
import {toast} from "sonner";

type Props = {
  data: ListWithCards[];
  boardId: string;
};

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

function ListContainer({data, boardId}: Props) {
  const [orderedData, setOrderedData] = useState(data);
  const {execute: executeUpdateListReorder} = useAction(updateListOrder, {
    onSuccess: () => {
      toast.success(`List reordered`);
    },
    onError: (error) => {
      toast.error(error);
    },
  });
  const {execute: executeUpdateCardOrder} = useAction(updateCardOrder, {
    onSuccess: () => {
      toast.success(`Card reordered`);
    },
    onError: (error) => {
      toast.error(error);
    },
  });
  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const onDragEnd = (result: any) => {
    const {destination, source, type} = result;
    if (!destination) return;
    // drop in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;
    // user moves
    if (type === "list") {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, idx) => ({...item, order: idx})
      );
      setOrderedData(items);
      executeUpdateListReorder({
        items,
        boardId,
      });

      // TODO trigger server actions
    }

    // user moves a card

    if (type === "card") {
      let newOrderedData = [...orderedData];

      // get source and destination list
      const sourceList = newOrderedData.find(
        (list) => list.id === source.droppableId
      );
      const destinationList = newOrderedData.find(
        (list) => list.id === destination.droppableId
      );

      if (!sourceList || !destination) return;
      // check if cards exists on the source list
      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      // if cards exist on destination list
      if (!destination.cards) {
        destination.cards = [];
      }

      // moving card in same list
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );
        reorderedCards.forEach((card, idx) => {
          card.order = idx;
        });
        sourceList.cards = reorderedCards;

        setOrderedData(newOrderedData);

        // trigger server actions
        executeUpdateCardOrder({
          boardId,
          items: reorderedCards,
        });
      } else {
        // user moves card to another list
        // remove card from source list
        const [movedCard] = sourceList.cards.splice(source.index, 1);

        // assing new listId to moved card
        movedCard.listId = destination.droppableId;

        // add card to destination list
        destinationList?.cards.splice(destination.index, 0, movedCard);

        sourceList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        // update order for each card in the destination list
        destinationList?.cards.forEach((card, idx) => {
          card.order = idx;
        });

        setOrderedData(newOrderedData);
        // TODO server actions
        executeUpdateCardOrder({
          boardId,
          items: destinationList?.cards!,
        });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full"
          >
            {orderedData.map((list, idx) => {
              return <ListItem key={list.id} index={idx} data={list} />;
            })}
            {provided.placeholder}
            <ListForm />
            <div className="flex shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default ListContainer;
