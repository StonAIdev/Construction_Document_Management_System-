import styled from 'styled-components'
const Heading2 = styled.h4`
  color: ${props => props.color? props.color: '#131419'};
  border:${props => props.border? props.border: ''};
  padding-inline: ${props => props.paddingInline? props.paddingInline: ''};
  padding-block: ${props => props.paddingBlock? props.paddingBlock: ''};
  border-radius: ${props => props.borderRadius? props.borderRadius: ''};
  font-size: ${props => props.size? props.size: '14px'};
  font-weight:${props => props.weight? props.weight: '400'};
  display:flex;
  width:100%;
  justify-content: center;
  opacity: 0.8;
  line-height: 2;
  margin-bottom:${props => props.marginBottom? props.weight: ''};

  @media (max-width: 992px) {
    font-size: ${props => props.SMsize? props.SMsize: '21.5px'};
    margin-bottom: ${props => props.SMmarginBottom? props.SMmarginBottom: '8px'};
  line-height: 1.5;
    
  }

  @media(max-width: 600px) {
    font-size: ${props => props.SMsize? props.SMsize: '16.5px'};
    margin-bottom: ${props => props.SMmarginBottom? props.SMmarginBottom: '6px'};
  line-height: 1.2;

  }
`
export default Heading2;

