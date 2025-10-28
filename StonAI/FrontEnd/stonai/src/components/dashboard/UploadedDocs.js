import {
    Avatar,
    Card,
    CardContent,
    Grid,
    Typography
  } from '@material-ui/core';
  import { indigo } from '@material-ui/core/colors';
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
  
  const UploadedDocs = (props) => (
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
              Uploaded Documents
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              200
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: indigo[600],
                height: 56,
                width: 56
              }}
            >
              <File />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
  
  export default UploadedDocs;