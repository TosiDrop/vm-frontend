import { useDispatch } from "react-redux";
import { InfoModalTypes, ModalTypes } from "src/entities/common.entities";
import { showModal } from "src/reducers/globalSlice";

export default function useModal() {
  const dispatch = useDispatch();

  const showInfoModal = (text: string) => {
    dispatch(
      showModal({
        modalType: ModalTypes.info,
        details: {
          text: text,
          type: InfoModalTypes.info,
        },
      })
    );
  };

  const showErrorModal = (text: string) => {
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

  const showSuccessModal = (text: string) => {
    dispatch(
      showModal({
        modalType: ModalTypes.info,
        details: {
          text: text,
          type: InfoModalTypes.success,
        },
      })
    );
  };

  return {
    showInfoModal,
    showErrorModal,
    showSuccessModal,
  };
}
