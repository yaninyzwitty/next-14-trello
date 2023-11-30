import {OrganizationProfile} from "@clerk/nextjs";
function SettingsPage() {
  return (
    <div className="w-full ">
      <OrganizationProfile
        appearance={{
          elements: {
            rootBox: {
              boxShadow: "none",
              width: "100",
            },
            card: {
              boxShadow: "none",
              width: "100%",
              border: "1px solid #e5e5e5",
            },
          },
        }}
      />
    </div>
  );
}

export default SettingsPage;
