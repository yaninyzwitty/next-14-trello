import {updateList} from "@/action/update-list";
import FormInput from "@/components/form/form-input";
import {useAction} from "@/hooks/use-action";
import {List} from "@prisma/client";
import {ElementRef, useRef, useState} from "react";
import {toast} from "sonner";
import {useEventListener} from "usehooks-ts";
import ListOptions from "./list-options";

type Props = {
  data: List;
  onAddCard: () => void;
};

function ListHeader({data, onAddCard}: Props) {
  const [title, setTitle] = useState(data.title);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<ElementRef<"input">>(null);
  const formRef = useRef<ElementRef<"form">>(null);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      formRef?.current?.requestSubmit();
    }
  };

  const disableEditing = () => {
    setIsEditing(false);
  };
  const handleSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;
    if (title === data.title) {
      disableEditing();
    }
    execute({title, id, boardId});
  };

  const onBlur = () => {
    formRef.current?.requestSubmit();
  };

  const {execute} = useAction(updateList, {
    onSuccess: (data) => {
      toast.success(`Renamed to ${data.title}`);
      setTitle(data.title);
      disableEditing();
    },
    onError: (error) => {
      toast.error(error);
    },
  });
  useEventListener("keydown", onKeyDown);

  return (
    <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2">
      {isEditing ? (
        <form className="flex-1 px-[2px]" action={handleSubmit} ref={formRef}>
          <input type="text " hidden id={"id"} name="id" value={data.id} />
          <input
            type="text "
            hidden
            id={"boardId"}
            name="boardId"
            value={data.boardId}
          />
          <FormInput
            ref={inputRef}
            onBlur={onBlur}
            placeholder="Enter List title..."
            id="title"
            className="text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input transition truncate bg-transparent focus:bg-white"
            defaultValue={title}
          />
          <button type="submit" hidden />
        </form>
      ) : (
        <div
          className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent"
          onClick={enableEditing}
        >
          {data.title}
        </div>
      )}
      <ListOptions data={data} onAddCard={onAddCard} />
    </div>
  );
}

export default ListHeader;
