import {
    Avatar,
    Card,
    CardContent,
    Grid,
    Typography
  } from '@material-ui/core';
  import { pink } from '@material-ui/core/colors';
  import FilterHdrIcon from '@material-ui/icons/FilterHdr';
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
  
  const TotalProjects = (props) => (
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
              Total Projects
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              10
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: pink[600],
                height: 56,
                width: 56
              }}
            >
              <FilterHdrIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
  
  export default TotalProjects;