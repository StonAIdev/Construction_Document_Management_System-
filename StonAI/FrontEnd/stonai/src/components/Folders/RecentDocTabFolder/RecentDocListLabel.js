import { Grid, Typography } from "@mui/material";

export const RecentDocListLabel = () => {
  return (
    <Grid container spacing={2} wrap="nowrap" sx={{ paddingLeft: 4 }}>
      <Grid item md={3} textAlign="left">
        <Typography
          sx={{
            paddingleft: 4,
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
          Document State
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
          Uploaded By
        </Typography>
      </Grid>
    </Grid>
  );
};
