import styled from "styled-components";
const ButtonStyled = styled.button`
  color: ${(props) => (props.color ? props.color : "#131419")};
  border: ${(props) => (props.border ? props.border : "")};
  padding-inline: ${(props) => props.paddingInline ? props.paddingInline : "2px"};
  padding-block: ${(props) => props.paddingBlock ? props.paddingBlock : "2px"};
  border-radius: ${(props) => props.borderRadius ? props.borderRadius : "2px"};
  font-size: ${(props) => (props.size ? props.size : "1rem")};
  background-color: ${(props) => props.backgroundColor ? props.backgroundColor : "transparent"};
  font-weight: ${(props) => (props.weight ? props.weight : "")};
  width: ${(props) => (props.width ? props.width : "")};
  height: ${(props) => (props.height ? props.height : "")};
  cursor:pointer;

  @media (max-width: 992px) {
    font-size: ${(props) => (props.Msize ? props.Msize : "")};
    padding-inline: ${(props) => props.MpaddingInline ? props.MpaddingInline : ""};
    padding-block: ${(props) => props.MpaddingBlock ? props.MpaddingBlock : ""};
  }
  @media (max-width: 600px) {
    font-size: ${(props) => (props.SMsize ? props.SMsize : "")};
    padding-inline: ${(props) => props.SMpaddingInline ? props.SMpaddingInline : ""};
    padding-block: ${(props) => props.SMpaddingBlock ? props.SMpaddingBlock : ""};
  }
`;
export default ButtonStyled;
