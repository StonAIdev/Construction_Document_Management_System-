import styled from "styled-components";
const Heading1 = styled.h1`
  color: ${(props) => (props.color ? props.color : "grey")};
  border: ${(props) => (props.border ? props.border : "none")};
  padding-inline: ${(props) =>    props.paddingInline ? props.paddingInline : ""};
  padding-block: ${(props) => (props.paddingBlock ? props.paddingBlock : "")};
  border-radius: ${(props) => (props.borderRadius ? props.borderRadius : "")};
 
  width: ${(props) => (props.width ? props.width : "100%")};
  font-size: ${(props) => (props.size ? props.size : "1rem")};
  font-weight: ${(props) => (props.weight ? props.weight : "400")};
  display: ${(props) => (props.display ? props.display : "flex")};
  margin-bottom: ${(props) => (props.marginBottom ? props.marginBottom : "")};
  justify-content: ${(props) => (props.JFcontent ? props.JFcontent : "center")};
  line-height: ${(props) => (props.lineHeight ? props.lineHeight : "")};
  fontFamily: ${(props) => (props.Ffamily ? props.Ffamily : "")};
  font-variant:${props => props.variant? props.variant: ''};
  text-align:${props => props.align? props.align: ''};


  @media (max-width: 1179px) {
    font-size: ${(props) => (props.Lgsize ? props.Lgsize : "")};
    margin-bottom: ${(props) => props.LgmarginBottom ? props.LgmarginBottom : ""};

  }

  @media (max-width: 992px) {
    font-size: ${(props) => (props.Msize ? props.Msize : "")};
    margin-bottom: ${(props) => props.MmarginBottom ? props.MmarginBottom : ""};

  }

  @media (max-width: 600px) {
    font-size: ${(props) => (props.SMsize ? props.SMsize : "")};
    margin-bottom: ${(props) => props.SMmarginBottom ? props.SMmarginBottom : ""};

  }
`;
export default Heading1;
