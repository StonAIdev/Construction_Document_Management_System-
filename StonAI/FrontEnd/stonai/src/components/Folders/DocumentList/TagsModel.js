import { Typography, Modal, Box } from "@mui/material";
import AddTagsBox from "./AddTagsBox";


const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 450,
    bgcolor: "background.paper",
    borderRadius: "10px",
    boxShadow: 24,
    p: 2,
    paddingBottom: "20px"
};
export default function TagsModel({ open, onClose, project, user, file, setFiles, files, department }) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Box
                    sx={{
                        backgroundColor: "var(--blue)",
                        height: "15%",
                        p: 2,
                        fontWeight: "bolder",
                    }}
                >
                    <Typography variant="h4" sx={{ color: "white" }}>
                        Attach Tags
                    </Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                    <AddTagsBox
                        project={project}
                        user={user}
                        file={file}
                        setFiles={setFiles}
                        files={files}
                        department={department}
                    />
                </Box>
            </Box>
        </Modal>
    )
}