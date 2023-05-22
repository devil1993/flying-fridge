import IdentityForm from "../Commons/IdentityForm";
function GratitudeForm({ gratitude, onSave }) {
  let userdata = {
    userName: gratitude.name,
    description: gratitude.description,
    profileImageUrl: gratitude.imagesrc,
  };
  const onIdentityFormSave = (identityItem, imageFile) => {
    const gratitudeItem = {
      id: gratitude.id,
      name: identityItem.userName,
      description: identityItem.description,
      imagesrc: identityItem.profileImageUrl,
      isEnabled: gratitude.isEnabled,
    };
    if (imageFile) onSave(gratitudeItem, imageFile);
    onSave(gratitudeItem);
  };
  return <IdentityForm onSave={onIdentityFormSave} userData={userdata} />;
}
export default GratitudeForm;
