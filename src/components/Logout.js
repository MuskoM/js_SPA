import { removeUserSession } from '../utils/Common';
import { store } from "react-notifications-component";


let Logout = (props) => {
    removeUserSession();
    props.history.push('/login');
    window.location.reload(false);
    store.addNotification({
        title: "You have logged out successfully.",
        type: "info",
        insert: "bottom",
        container: "bottom-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
            duration: 5000,
            onScreen: true,
        },
      });
    
}

export default Logout;