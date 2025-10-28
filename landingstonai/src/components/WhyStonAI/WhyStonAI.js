import React from 'react'
import WhyCards from './Sections/WhyCards'
import './WhyStonAI.css'
import Fade from 'react-reveal/Fade';
import SubHeading from '../../Reusable Components/Headings/SubHeading';
import { faBraille, faChartLine, faClock, faCrosshairs, faMoneyBillAlt } from '@fortawesome/free-solid-svg-icons';

const WhyCardDetails = [
    {
        id: 1,
        title: 'Time',
        details: 'StonAI using our proprietary AI model saves 30% of your employees time by automating tasks, finding information in documents faster and accurate, extract and action information and data.',
        image: faClock,

    },
    {
        id: 2,
        title: 'Accuracy',
        details: 'StonAI base models are of high accuracy using state of art latest AI advanced models enhanced through the unique user profile of each employee work profile.',
        image: faCrosshairs,
    },

    {
        id: 3,
        title: 'Business Intelligence',
        details: 'StonAI platform enhances your data infrastructure and processes through its dynamic adaptation to your employees and project dashboards.StonAI unleashes your strengths and enhances your project processes through dashboards.',
        image: faBraille,
    },

    {
        id: 4,
        title: 'Efficiency',
        details: 'StonAI assists users with process management, automation and work requirements en-hancing employees’ efficiency to focus on important tasks.',
        image: faChartLine,
    },

    {
        id: 5,
        title: 'Cost Saving',
        details: 'StonAI reduces data and information extraction, tasks management and task automation costs up to 30% of the project value StonAI platform guarantees to recover its subscription costs within the first month of subscription.',
        image: faMoneyBillAlt,
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
