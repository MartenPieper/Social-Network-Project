import axios from 'axios';


// Adding csurf token to axios
var instance = axios.create({
    xsrfCookieName: 'mytoken',
    xsrfHeaderName: 'csrf-token'
});

export default instance;
