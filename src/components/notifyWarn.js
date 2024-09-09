import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function notifyWarn(text) {
    toast.warn(text)
}