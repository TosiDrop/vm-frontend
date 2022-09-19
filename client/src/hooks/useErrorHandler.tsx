import { useDispatch } from "react-redux";
import { InfoModalTypes, ModalTypes } from "src/entities/common.entities";
import { showModal } from "src/reducers/globalSlice";

const useErrorHandler = () => {
  const dispatch = useDispatch();

  const handleError = (e: any) => {
    let text = "Something is wrong :(";
    if (e.response) {
      // handle error thrown by backend
      if (e.response?.data?.error) {
        text = e.response?.data?.error;
      } else {
        text = "backend fails to return error";
      }
    } else if (e.response) {
      // handle error thrown by frontend
      text = e.message;
    } else {
      // might be error from wallet
      text = e;
    }

    dispatch(
      showModal({
        modalType: ModalTypes.info,
        details: {
          text: text,
          type: InfoModalTypes.failure,
        },
      })
    );
  };

  return {
    handleError,
  };
};

export default useErrorHandler;
