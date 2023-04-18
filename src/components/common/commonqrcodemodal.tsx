import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { loginStateCheck } from "../../utils/verifiedcheck";

const CommonQRCodeModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (loginStateCheck() === false) {
    return <></>;
  }

  const downloadQRCodeImage = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log(loginStateCheck());
    const linkURL = `https://api.qrserver.com/v1/create-qr-code/?data=https://waitsecond.vercel.app/store/${loginStateCheck()}&size=800x800`;
    fetch(linkURL, {
      method: "GET",
    })
      .then((response) => response.blob())
      .then((blob) => {
        const blobData = new Blob([blob]);

        const fileObjectURL = window.URL.createObjectURL(blobData);
        const downloadAnchor = document.createElement("a");
        downloadAnchor.href = fileObjectURL;
        downloadAnchor.style.display = "none";

        downloadAnchor.download = "QRCode.png";

        downloadAnchor.click();
        downloadAnchor.remove();

        window.URL.revokeObjectURL(fileObjectURL);
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent wordBreak="keep-all" padding="1.5rem 0" margin="2rem 1rem">
        <ModalHeader
          fontSize="1.25rem"
          fontWeight="semibold"
          padding="0 1rem"
          textAlign="center"
          margin="0.5rem 0"
        >
          임시 QR 코드
        </ModalHeader>
        <ModalBody display="flex" flexDirection="column" gap="1rem">
          <Image
            src={`https://api.qrserver.com/v1/create-qr-code/?data=https://waitsecond.vercel.app/store/${loginStateCheck()}&size=250x250`}
          />
          코드 인쇄 등을 위해 이미지를 저장하고 싶으시면 아래를 클릭해주세요.
        </ModalBody>
        <ModalFooter
          display="flex"
          flexDirection="column"
          width="100%"
          gap="1rem"
        >
          <Button
            type="button"
            background="mainBlue"
            color="#FFFFFF"
            fontWeight="medium"
            fontSize="1.25rem"
            padding="0.5rem 0"
            width="100%"
            borderRadius="0.25rem"
            height="3rem"
            onClick={downloadQRCodeImage}
          >
            코드 이미지 다운로드
          </Button>
          <Button
            type="button"
            background="accentGray"
            color="#FFFFFF"
            fontWeight="medium"
            fontSize="1.25rem"
            padding="0.5rem auto"
            width="100%"
            borderRadius="0.25rem"
            height="3rem"
            onClick={onClose}
          >
            창 닫기
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CommonQRCodeModal;
