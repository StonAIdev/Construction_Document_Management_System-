import styled from 'styled-components'
const SubHeading = styled.h1`
  color: ${props => props.color? props.color: 'var(--blue)'};
  border:${props => props.border? props.border: ''};
  padding-inline: ${props => props.paddingInline? props.paddingInline: ''};
  padding-block: ${props => props.paddingBlock? props.paddingBlock: ''};
  border-radius: ${props => props.borderRadius? props.borderRadius: ''};
  font-size: ${props => props.size? props.size: '35px'};
  font-weight:${props => props.weight? props.weight: '500'};
  display:flex;
  width:fit-content;
  justify-content: center;
  opacity: 1;
  line-height: 2;
  font-variant:${props => props.variant? props.variant: 'NORMAL'};
  text-transform: uppercase;

  margin-bottom:${props => props.marginBottom? props.marginBottom: ''};

  @media (max-width: 992px) {
    font-size: ${props => props.SMsize? props.SMsize: '30.5px'};
    margin-bottom: ${props => props.SMmarginBottom? props.SMmarginBottom: '10px'};
  line-height: 1.5;
    
  }

  @media(max-width: 600px) {
    font-size: ${props => props.SMsize? props.SMsize: '28.5px'};
    margin-bottom: ${props => props.SMmarginBottom? props.SMmarginBottom: '10px'};
    
  line-height: 1.5;

  }
`
export default SubHeading;

