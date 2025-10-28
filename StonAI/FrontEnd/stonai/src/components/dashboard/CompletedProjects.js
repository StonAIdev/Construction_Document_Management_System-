import {
    Avatar,
    Card,
    CardContent,
    Grid,
    Typography
  } from '@material-ui/core';
  import { indigo } from '@material-ui/core/colors';
  import GavelIcon from '@material-ui/icons/Gavel';
  import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
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
  
  const CompletedProjects = (props) => (
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
              Completed Projects
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              5
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: 'green',
                height: 56,
                width: 56
              }}
            >
              <DoneOutlineIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
  
  export default CompletedProjects;