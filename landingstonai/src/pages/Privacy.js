import React from 'react';
import "../components/Privacy/Privacy.css"
import Heading1 from '../Reusable Components/Headings/Heading1';
import PrivacyPolicy from '../components/Privacy/PrivacyPolicy';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Terms from '../components/Privacy/Terms';
import ReturnPolicy from '../components/Privacy/ReturnPolicy';
import Footer from '../components/Footer/Footer';

function Privacy() {
    React.useEffect(() => {
        window.scrollTo(0, 0);
        //document.scrollTo(0,0)
      }, []);
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        // window.scrollTo(0, 0);
        setValue(newValue);
    };

    return (
        <div className='privacybackground' id="legal">
            <div className='container '>

                <Heading1
                    size="2rem"
                    weight="700"
                    width="fit-content"
                    style={{ marginBottom: "2rem" }}

                > Legal </Heading1>


                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            allowScrollButtonsMobile
                        >
                            <Tab label="Privacy Policy" {...a11yProps(0)} />
                            <Tab label="Terms and Conditions" {...a11yProps(1)} />
                            <Tab label="Return Policy" {...a11yProps(2)} />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                       
                        <div className='privacysplit privacycolumn'>
                            <PrivacyPolicy />
                        </div>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                       
                        <div className='privacysplit '>
                            <Terms />
                        </div>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                       
                        <div className='privacysplit '>
                            <ReturnPolicy />
                        </div>
                    </TabPanel>
                </Box>

            </div>
            <Footer/>
        </div>
    );
}

export default Privacy;



function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}
