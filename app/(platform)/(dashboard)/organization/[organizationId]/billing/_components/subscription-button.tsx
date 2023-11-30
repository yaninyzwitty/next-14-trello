"use client";

import {stripeRedirect} from "@/action/stripe-redirect";
import {Button} from "@/components/ui/button";
import {useAction} from "@/hooks/use-action";
import {useProModal} from "@/hooks/use-pro-modal";
import {toast} from "sonner";

type Props = {
  isPro: boolean;
};

function SubscriptionButton({isPro}: Props) {
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
    if (isPro) {
      execute({});
    } else {
      proModal.onOpen();
    }
  };
  return (
    <Button variant={"primary"} disabled={isLoading} onClick={onClick}>
      {isPro ? "Manage Subscription" : "Upgrade to Pro"}
    </Button>
  );
}

export default SubscriptionButton;
