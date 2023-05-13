import react from 'react'
import IdentityForm from '../Commons/IdentityForm';
function GratitudeForm({gratitude, onSave}){
    let userdata = {
        userName: gratitude.name,
        description: gratitude.description,
        profileImageUrl: gratitude.imagesrc
    }
    return <IdentityForm onSave={onSave} userData={userdata}/>
}
export default GratitudeForm;