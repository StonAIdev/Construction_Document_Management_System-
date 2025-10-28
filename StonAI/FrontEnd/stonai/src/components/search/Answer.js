import { Avatar, Card, CardContent, Grid, Typography } from "@material-ui/core";
import { indigo } from "@material-ui/core/colors";
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
  Folder,
} from "react-feather";

const Answer = (props) => (
  <Card {...props}>
    <CardContent>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
      >
        <Typography color="textSecondary" variant="h6">
          {props?.item[1]}
        </Typography>
      </Grid>
    </CardContent>
  </Card>
);

export default Answer;
