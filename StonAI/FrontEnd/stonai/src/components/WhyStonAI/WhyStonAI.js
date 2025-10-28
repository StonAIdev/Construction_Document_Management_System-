import React from 'react'
import WhyCards from './Sections/WhyCards'
import './WhyStonAI.css'
import Fade from 'react-reveal/Fade';
import SubHeading from '../../Reusable Components/Headings/SubHeading';
import Img1 from './Assets/image1.png'
import Img2 from './Assets/image2.png'
import Img3 from './Assets/image3.jpg'
import Img4 from './Assets/image4.png'
import Img5 from './Assets/image5.png'
import { color } from '@mui/system';
import { faBraille, faBrain, faChartLine, faClock, faCrosshairs, faMoneyBillAlt } from '@fortawesome/free-solid-svg-icons';

const WhyCardDetails = [
    {
        id: 1,
        title: 'Time',
        details: 'StonAI using our proprietary AI model saves 30% of your employees time by automating tasks, finding information in documents faster and accurate, extract and action information and data.',
        image: faClock,
        Iconcolor:"var(--darkblue)"

    },
    {
        id: 2,
        title: 'Accuracy',
        details: 'StonAI base models are of high accuracy using state of art latest AI advanced models enhanced through the unique user profile of each employee work profile.',
        image: faCrosshairs,
        color:"var(--orange)"
    },

    {
        id: 3,
        title: 'Business Intelligence',
        details: 'StonAI platform enhances your data infrastructure and processes through its dynamic adaptation to your employees and project dashboards.StonAI unleashes your strengths and enhances your project processes through dashboards.',
        image: faBraille,
        Iconcolor: "var(--orange)"
    },

    {
        id: 4,
        title: 'Efficiency',
        details: 'StonAI assist users with process management, automation and work requirements en-hancing employees’ efficiency to focus on important tasks.',
        image: faChartLine,
        Iconcolor:"var(--blue)"
    },

    {
        id: 5,
        title: 'Cost Saving',
        details: 'StonAI reduces data and information extraction, tasks management and task automation costs up to 30% of the project value StonAI platform guarantees to recover its subscription costs within the first month of subscription.',
        image: faMoneyBillAlt,
        Iconcolor:"var(--darkblue)"
    },





]

function WhyStonAI() {
    return (
        <div className='whystonaiContainer container'>

            <div>

                <SubHeading variant="">
                    <Fade top cascade>
                        Why stonAI
                    </Fade>
                </SubHeading>


                <hr className='headingLine' />
            </div>

            <div className='CardsDiv d-flex flex-wrap p-0 align-items-start '
                style={{ width: "100vw", gap: "1rem" }}>
                <Fade bottom>
                    {
                        WhyCardDetails.map((data) => {
                            return (
                                <WhyCards key={data.id}
                                    title={data.title}
                                    details={data.details}
                                    image={data.image}
                                    Iconcolor={data.Iconcolor}
                                />
                            );
                        })
                    }
                </Fade>
            </div>
        </div>
    )
}

export default WhyStonAI
