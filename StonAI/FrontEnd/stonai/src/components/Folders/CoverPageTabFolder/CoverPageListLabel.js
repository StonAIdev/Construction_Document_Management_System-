import { Grid, Typography } from "@mui/material";

export const CoverPageListLabel = () => {
  return (
    <Grid container spacing={2} wrap="nowrap" >
      <Grid item md={.5}>
        {/* Do not remove */}
      </Grid>
      <Grid item md={3.5} textAlign="left">
        <Typography
          sx={{
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
          Phase
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
      <Grid item md={1}>
        {/* Do not remove */}
      </Grid>
    </Grid>
  );
};
