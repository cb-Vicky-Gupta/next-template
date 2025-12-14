import toast from "react-hot-toast";

export const actionNotifier = {
  
  success: (message:string) => {
    toast.success(message);
  },

  error: (message:string) => {
    toast.error(message);
  },

  warning: (message:string) => {
    toast(message);
  },

  info: (message:string) => {
    toast(message);
  },

  loading: (message = "Please wait...") => {
    return toast.loading(message, {
      style: {
        background: "#4b5563",
        color: "white",
        borderRadius: "10px"
      }
    });
  },

  dismiss: (toastId:string) => {
    toast.dismiss(toastId);
  },

  custom: (component:any) => {
    toast.custom(component);
  }
};
