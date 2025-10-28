import { Grid, Typography } from "@mui/material";

export const DocumentListLabel = () => {
  return (
    <>
      <Grid item md={4} textAlign="left">
        <Typography
          sx={{
            marginLeft: 10,
            fontWeight: "bolder",
            fontSize: 14,
            color: "var(--fontGray)",
          }}
          variant="caption"
          display="block"
          gutterBottom
        >
          Name
        </Typography>
      </Grid>
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
          Document Category
        </Typography>
      </Grid>
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
          Contractor
        </Typography>
      </Grid>
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
    </>
  );
};
