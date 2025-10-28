import {
    Avatar,
    Card,
    CardContent,
    Grid,
    Typography
  } from '@material-ui/core';
  import { orange } from '@material-ui/core/colors';
  import GavelIcon from '@material-ui/icons/Gavel';
  import {
    AlertCircle as AlertCircleIcon,
    BarChart as BarChartIcon,
    Inbox,
    Send,
    File,
    Lock as LockIcon,
    Settings as SettingsIcon,
    User as UserIcon,
    UserPlus as UserPlusIcon,
    Folder
  } from 'react-feather';
  
  const UploadedContracts = (props) => (
    <Card {...props}>
      <CardContent>
        <Grid
          container
          spacing={3}
          sx={{ justifyContent: 'space-between' }}
        >
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="h6"
            >
              Uploaded Contracts
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              100
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: orange[600],
                height: 56,
                width: 56
              }}
            >
              <GavelIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
  
  export default UploadedContracts;