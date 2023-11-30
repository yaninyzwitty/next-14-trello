"use client";
import Link from "next/link";
import {PlusIcon} from "lucide-react";
import {useLocalStorage} from "usehooks-ts";
import {Separator} from "@/components/ui/separator";
import {Skeleton} from "@/components/ui/skeleton";
import {Accordion} from "@/components/ui/accordion";
import {useOrganization, useOrganizationList} from "@clerk/nextjs";
import {Button} from "@/components/ui/button";
import NavItem, {Organization} from "./nav-item";
interface Props {
  storageKey?: string;
}
function Sidebar({storageKey}: Props) {
  storageKey = "t-sidebar-state";
  const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(
    storageKey,
    {}
  );
  const {organization: activeOrganization, isLoaded: isLoadedOrg} =
    useOrganization();
  const {userMemberships, isLoaded: isLoadedOrgList} = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  const defaultAccordionValue: string[] = Object.keys(expanded).reduce(
    (acc: string[], key: string) => {
      if (expanded[key]) {
        acc.push(key);
      }
      return acc;
    },
    []
  );

  const onExpand = (id: string) => {
    // setExpanded({...expanded, [id]: !expanded[id]});
    setExpanded((curr) => ({
      ...curr,
      [id]: !expanded[id],
    }));
  };

  if (!isLoadedOrg || !isLoadedOrgList || userMemberships.isLoading) {
    return (
      <>
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-10 w-[50%]" />
          <Skeleton className="h-10 w-10" />
        </div>
        <div className="space-y-2 ">
          <NavItem.Skeleton />
          <NavItem.Skeleton />
          <NavItem.Skeleton />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="font-medium text-xs flex items-center mb-1">
        <span className="pl-4">Workspaces</span>
        <Button
          asChild
          type="button"
          variant={"ghost"}
          className="ml-auto"
          size={"icon"}
        >
          <Link href={"/select-org"}>
            <PlusIcon className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <Accordion
        type="multiple"
        defaultValue={defaultAccordionValue}
        className="space-y-2"
      >
        {userMemberships?.data.map(({organization}) => (
          <NavItem
            key={organization.id}
            isActive={activeOrganization?.id === organization.id}
            isExpanded={expanded[organization.id]}
            organization={organization as Organization}
            onExpand={onExpand}
          />
        ))}
      </Accordion>
    </>
  );
}

export default Sidebar;
