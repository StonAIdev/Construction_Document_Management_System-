import { Checkbox } from "@material-ui/core";
import { Grid, Typography } from "@mui/material";

export const DocumentListLabel = ({
  viewDocName,
  viewSubmittalTitle,
  viewDocRef,
  viewDocType,
  viewContractor,
  viewSubContractor,
  viewTags,
  ViewUploadDate,
  ViewSubmittalDate,
  viewStatus,
  viewDicipline,
  viewUpdateby,
  isSubmittalDoc,
  currentComp
}) => {
  return (
    <>

      <Grid container spacing={0} wrap="nowrap" sx={{
        backgroundColor: "#bedfff",
        marginLeft: "10px",
        paddingInline: "20px",
        display: "flex",
        alignItems: "center",
        marginLeft: 1,
        borderTopLeftRadius: "10px",
        borderTopRightRadius: "10px",
        height: "50px",
        fontWeight: 700
      }}>

        <Grid item md={0.5} sx={{
          marginLeft: "10px",
          paddingInline: "20px",
          display: "flex",
          alignItems: "center",
          marginLeft: 1
        }}>

        </Grid>
        {viewDocName ?
          <Grid item md={2} textAlign="left">
            <Typography
              sx={{
                // marginLeft: 10,
                fontWeight: "bolder",
                fontSize: 14,
                color: "var(--fontGray)",
              }}
              variant="caption"
              display="block"
              gutterBottom
            >
              Document Name
            </Typography>
          </Grid>
          : null}
        {isSubmittalDoc(currentComp) && viewSubmittalTitle ?
          <Grid item md={2} textAlign="left">
            <Typography
              sx={{
                // marginLeft: 10,
                fontWeight: "bolder",
                fontSize: 14,
                color: "var(--fontGray)",
              }}
              variant="caption"
              display="block"
              gutterBottom
            >
              Submital Title
            </Typography>
          </Grid>
          : null}

        {isSubmittalDoc(currentComp) && viewDocRef ?
          <Grid item md={2}>
            <Typography
              variant="caption"
              display="block"
              sx={{
                color: "var(--fontGray)",
                fontSize: 14,
                fontWeight: "bolder",
              }}
              gutterBottom
            >
              Submital No.
            </Typography>
          </Grid>
          : null}
        {viewDocType ?
          <Grid item md={2}>
            <Typography
              variant="caption"
              display="block"
              sx={{
                color: "var(--fontGray)",
                fontSize: 14,
                fontWeight: "bolder",
              }}
              gutterBottom
            >
              Document Type
            </Typography>
          </Grid>
          : null}

        {viewContractor ?
          <Grid item md={2}>
            <Typography
              variant="caption"
              display="block"
              sx={{
                color: "var(--fontGray)",
                fontSize: 14,
                fontWeight: "bolder",
              }}
              gutterBottom
            >
              Contractor 
            </Typography>
          </Grid>
          : null}
        {viewSubContractor ?
          <Grid item md={3}>
            <Typography
              variant="caption"
              display="block"
              sx={{
                color: "var(--fontGray)",
                fontSize: 14,
                fontWeight: "bolder",
              }}
              gutterBottom
            >
              Subcontractor

            </Typography>
          </Grid>
          : null}
          {viewTags ?
          <Grid item md={3}>
            <Typography
              variant="caption"
              display="block"
              sx={{
                color: "var(--fontGray)",
                fontSize: 14,
                fontWeight: "bolder",
              }}
              gutterBottom
            >
              Tags
            </Typography>
          </Grid>
          : null}
          
        {ViewUploadDate ?
          <Grid item md={2}>
            <Typography
              variant="caption"
              display="block"
              sx={{
                color: "var(--fontGray)",
                fontSize: 14,
                fontWeight: "bolder",
              }}
              gutterBottom
            >
              Uploaded Date
            </Typography>
          </Grid>
          : null}
        {isSubmittalDoc(currentComp) && ViewSubmittalDate ?
          <Grid item md={2}>
            <Typography
              variant="caption"
              display="block"
              sx={{
                color: "var(--fontGray)",
                fontSize: 14,
                fontWeight: "bolder",
              }}
              gutterBottom
            >
              Submittal Date
            </Typography>
          </Grid>
          : null}

        {isSubmittalDoc(currentComp) && viewStatus ?
          <Grid item md={1
          }>
            <Typography
              variant="caption"
              display="block"
              sx={{
                color: "var(--fontGray)",
                fontSize: 14,
                fontWeight: "bolder",
              }}
              gutterBottom
            >
              Status
            </Typography>
          </Grid>
          : null}
        {isSubmittalDoc(currentComp) && viewDicipline ?
          <Grid item md={2}>
            <Typography
              variant="caption"
              display="block"
              sx={{
                color: "var(--fontGray)",
                fontSize: 14,
                fontWeight: "bolder",
              }}
              gutterBottom
            >
              Discipline
            </Typography>
          </Grid>
          : null}
        {viewUpdateby ?
          <Grid item md={2}>
            <Typography
              variant="caption"
              display="block"
              sx={{
                color: "var(--fontGray)",
                fontSize: 14,
                fontWeight: "bolder",
              }}
              gutterBottom
            >
              Uploaded By
            </Typography>
          </Grid>
          : null}

        <Grid item md={2}>
        </Grid>
      </Grid>
    </>
  );
};
