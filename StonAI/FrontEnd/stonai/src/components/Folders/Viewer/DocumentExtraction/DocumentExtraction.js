export const updateHash = (id) => {
  document.location.hash = `highlight-${id}`;
};
const onChangeHandler2 = (e, value, name, setValues, values) => {
  console.log("valueDocEx", e, value, name, values);
  if (value) {
    updateHash(value.id);
    // const tempvalues = { ...values };
    setValues({
      ...values,
      [`${name}`]: value.label,
      // Confidences:{...tempvalues.Confidences,[name]:null}
    });
    // console.log("randy", {
    //   ...tempvalues,
    //   [name]: value.label,
    //   // Confidences:{...tempvalues.Confidences,[name]:null}
    // });
  }
};
export const selectionRawText = (e, value, name, setValues, values) => {
  onChangeHandler2(e, value, name, setValues, values);
};
export const multipleSelectionRawText = (e, value, name, setValues, values) => {
  console.log("valueDocEx", e, value, name, values);

  var tempList = [];
  value.forEach((element) => {
    tempList.push(element?.label ?? element);
  });
  if (value) {
    setValues({
      ...values,
      [name]: tempList,
    });
  }
};

export function PreparingRawTextForOptions(extractedFeilds) {
  var Raw_Text = [];
  console.log("2222", Raw_Text);
  console.log("111", extractedFeilds);
  if (extractedFeilds?.unMapped_field?.Raw_Text) {
    for (const element of extractedFeilds?.unMapped_field?.Raw_Text) {
      if (!Raw_Text.some((el) => el.label === element.Text)) {
        Raw_Text.push({ label: element?.Text, id: element?.id });
      }
    }
  }
  return Raw_Text;
}

export function PrepareConfidenceScore() {}
