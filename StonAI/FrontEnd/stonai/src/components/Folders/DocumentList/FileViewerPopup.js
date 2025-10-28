import { Modal, Box, Card, Container, Typography } from '@mui/material';
import { OutTable, ExcelRenderer } from 'react-excel-renderer';
// import DocViewer from "react-doc-viewer";
import FileViewer from "react-file-viewer";

// import "./FileViewer.css";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "65vw",
    bgcolor: "var(--background)",
    boxShadow: 24,
    height: "70vh",
    borderRadius: "8px !important",
};


const onError = (e) => {
    console.log(e, "error in file-viewer");
};


const FileViewerPopup = ({ open, setOpen, file }) => {
    console.log("file viewer", file.type);
    // const docs = [

    //     { uri: file },
    // ];

    const handleClose = () => setOpen(false);

    const checkFileType = () => {
        if (file.type === ".xls" || file.type === ".xlsx" || file.type === "application/vnd.ms-excel" || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            return "xlsx"
        }
        else if (file.type === "application/pdf") {
            return "pdf"

        }
        else if (file.type === "image/jpeg") {
            return "jpeg"

        }
        else if (file.type === "image/png") {
            return "png"

        }
        else if (file.type === "image/gif") {
            return "gif"

        }
        else if (file.type === "image/bmp") {
            return "bmp"

        }
        else if (file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            return "docx"

        }
        else {
            return file.type
        }




    }
    return (




        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >

            <Box sx={style}>
                <Box
                    sx={{
                        backgroundColor: "var(--blue)",
                        height: "10%",
                        p: 2,
                        fontWeight: "bolder",
                        display: "flex",
                        alignItems: "center",
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px",
                    }}
                >
                    <Typography variant="h4" sx={{ color: "white" }}>
                        Document view
                    </Typography>
                </Box>
                <Box sx={{ width: "100%", height: "90%" }}>

                    <FileViewer
                        fileType={checkFileType()}
                        filePath={file.urls}
                        onError={onError}
                    />

                </Box>



            </Box>


        </Modal>

    )
}

export default FileViewerPopup;