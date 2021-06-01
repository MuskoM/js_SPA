import { removeUserSession } from '../utils/Common';

let Logout = (props) =>{
    removeUserSession();
    props.history.push('/login');
    window.location.reload(false);

    
}

export default Logout;