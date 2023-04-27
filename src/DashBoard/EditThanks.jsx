import { useNavigate } from 'react-router-dom';
import { checkUserLoggedIn } from '../Commons/FirebaseService'
import { Alert, Button } from '@mui/material';

function EditThanks(){
    let user = checkUserLoggedIn();
    const navigate = useNavigate();
    const navigateToLogin = (event) => {
        navigate('/login');
    }
    if (!user){
        return (
            <Alert severity="error" action={ <Button color="inherit" size="small" onClick={navigateToLogin}> Log In </Button> }>
                You are not logged in, please log in to view this page.
            </Alert>
        )
    }


    return <h1>Place to edit your gratitude list, {user.email}</h1>
}

export default EditThanks;