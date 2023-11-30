import {startCase} from "lodash";
import {auth} from "@clerk/nextjs";
import OrgControl from "./_components/org-control";

export async function generateMetadata() {
  const {orgSlug} = auth();

  return {
    title: startCase(orgSlug || "organization"),
  };
}

export async function generateMetaData() {
  const {orgSlug} = auth();

  return {
    title: startCase(orgSlug || "organization"),
  };
}

function OrganizationIdLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      {/* <OrgControl /> */}
      {children}
    </>
  );
}

export default OrganizationIdLayout;
