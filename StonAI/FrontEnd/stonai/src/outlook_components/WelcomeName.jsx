import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import Typography from "@material-ui/core/Typography";

const WelcomeName = () => {
  const { instance } = useMsal();
  const [name, setName] = useState(null);
  console.log("msalllll", instance);

  const activeAccount = instance.getActiveAccount();

  useEffect(() => {
    if (activeAccount) {
      setName(activeAccount.name.split(" ")[0]);
    }
  }, [activeAccount]);

  if (name) {
    return (
      <Typography variant="h6" style={{ fontWeight: "bolder" }}>
        Welcome, {name}
      </Typography>
    );
  } else {
    return null;
  }
};

export default WelcomeName;
