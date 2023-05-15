import react from "react";
import IdentityForm from "../Commons/IdentityForm";
function GratitudeForm({ gratitude, onSave }) {
  let userdata = {
    userName: gratitude.name,
    description: gratitude.description,
    profileImageUrl: gratitude.imagesrc,
  };
  const onIdentityFormSave = (identityItem) => {
    const gratitudeItem = {
      id: gratitude.id,
      name: identityItem.userName,
      description: identityItem.description,
      imagesrc: identityItem.profileImageUrl,
    };
    onSave(gratitudeItem);
  };
  return <IdentityForm onSave={onIdentityFormSave} userData={userdata} />;
}
export default GratitudeForm;
