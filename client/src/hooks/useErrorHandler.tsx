import { useDispatch } from "react-redux";
import { InfoModalTypes, ModalTypes } from "src/entities/common.entities";
import { showModal } from "src/reducers/globalSlice";

const useErrorHandler = () => {
  const dispatch = useDispatch();

  const handleError = (e: any) => {
    let text: string;
    if (e.response) {
      /** handle error thrown by backend */
      if (e.response?.data?.error) {
        text = e.response?.data?.error;
      } else {
        text = "backend fails to return error";
      }
    } else if (e.message) {
      /** handle error thrown by frontend */
      text = e.message;
    } else {
      /** might be error from wallet */
      if (typeof e === "string") {
        text = e;
      } else if (typeof e === "object") {
        text = JSON.stringify(e);
      } else {
        text = "Something is wrong :(";
      }
    }

    dispatch(
      showModal({
        modalType: ModalTypes.info,
        details: {
          text,
          type: InfoModalTypes.failure,
        },
      }),
    );
  };

  return {
    handleError,
  };
};

export default useErrorHandler;
