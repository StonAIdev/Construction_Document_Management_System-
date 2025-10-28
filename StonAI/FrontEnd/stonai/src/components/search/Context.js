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

const Context = (props) => (
  <Card {...props}>
    <CardContent>
      <Grid item>
        <Typography color="textSecondary" gutterBottom variant="h6">
          {props?.item[0]}
        </Typography>
      </Grid>
    </CardContent>
  </Card>
);

export default Context;
