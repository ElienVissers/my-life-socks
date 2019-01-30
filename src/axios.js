import axios from 'axios';

var instance = axios.create({
    xsrfCookieName: 'mytoken',
    xsrfHeaderName: 'csrf-token'
});

export default instance;
//because we export default; when we import we can just say import x from './axios' (doesn't matter what we call it: x, instance, axios...)
