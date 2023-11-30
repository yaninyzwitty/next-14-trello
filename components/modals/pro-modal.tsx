"use client";

import React from "react";
import {Dialog, DialogContent} from "../ui/dialog";
import {useProModal} from "@/hooks/use-pro-modal";
import Image from "next/image";
import {Button} from "../ui/button";
import {useAction} from "@/hooks/use-action";
import {stripeRedirect} from "@/action/stripe-redirect";
import {toast} from "sonner";

function ProModal() {
  const proModal = useProModal();
  const {execute, isLoading} = useAction(stripeRedirect, {
    onSuccess: (data) => {
      window.location.href = data;
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onClick = () => {
    execute({});
  };
  return (
    <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <div className="aspect-video relative flex items-center justify-center">
          <Image src={`/hero.svg`} alt="Hero" className="object-cover" fill />
        </div>
        <div className="text-neutral-700 mx-auto space-y-6 p-6">
          <h2 className="font-semibold text-xl">
            Upgrade to taskify pro today!
          </h2>
          <p className="text-xs font-semibold text-neutral-600">
            Explore the best of taskify
          </p>
          <div className="pl-3">
            <ol className="text-sm list-disc">
              <li>Unlimited Boards</li>
              <li>Advanced checklists</li>
              <li>Admin and security features</li>
              <li>And more</li>{" "}
            </ol>
          </div>
          <Button
            className="w-full"
            variant={"primary"}
            disabled={isLoading}
            onClick={onClick}
          >
            Upgrade
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProModal;
