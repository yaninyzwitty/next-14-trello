"use client";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {CardWithList} from "@/types";
import {Copy, Trash} from "lucide-react";
import React from "react";
import {useAction} from "@/hooks/use-action";
import {copyCard} from "@/action/copy-card";
import {deleteCard} from "@/action/delete-card";
import {useParams} from "next/navigation";
import {useCardModal} from "@/hooks/use-card-modal";
import {toast} from "sonner";

type Props = {
  data: CardWithList;
};

function Actions({data}: Props) {
  const cardModal = useCardModal();
  const {execute: executeCopyCard, isLoading: isLoadingCopy} = useAction(
    copyCard,
    {
      onSuccess: (data) => {
        toast.success(`${data.title} copied`);
        cardModal.onClose();
      },
      onError: (error) => {
        toast.error(error);
      },
    }
  );
  const params = useParams();
  const onCopy = () => {
    const boardId = params.boardId as string;

    executeCopyCard({
      id: data.id,
      boardId,
    });
  };
  const onDelete = () => {
    const boardId = params.boardId as string;

    executeDeleteCard({
      id: data.id,
      boardId,
    });
  };
  const {execute: executeDeleteCard, isLoading: isLoadingDeleteCard} =
    useAction(deleteCard, {
      onSuccess: (data) => {
        toast.success(`${data.title} deleted`);
        cardModal.onClose();
      },
      onError: (error) => {
        toast.error(error);
      },
    });
  return (
    <div className="space-y-2 mt-2 ">
      <p className="text-xs font-semibold">Actions</p>
      <Button
        variant={"gray"}
        className="w-full justify-start"
        onClick={onCopy}
        disabled={isLoadingCopy}
        size={"inline"}
      >
        <Copy className="h-4 w-4 mr-2" />
        Copy
      </Button>
      <Button
        variant={"gray"}
        className="w-full justify-start"
        size={"inline"}
        onClick={onDelete}
        disabled={isLoadingDeleteCard}
      >
        <Trash className="h-4 w-4 mr-2" />
        Delete
      </Button>
    </div>
  );
}

export default Actions;

Actions.Skeleton = function ActionsSkeleton() {
  return (
    <div className="space-y-2 mt-2">
      <Skeleton className="w-20 h-4 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
    </div>
  );
};
