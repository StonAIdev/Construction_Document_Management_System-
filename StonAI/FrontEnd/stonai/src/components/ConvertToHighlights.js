export const convertRawTextToHighlight = async (
  rawText,
  page_height,
  page_width
) => {
  var highlights = rawText.map((h, index) => ({
    Text: h.Text,
    content: {
      text: h.Text,
    },
    position: {
      boundingRect: {
        x1: h.x1,
        y1: h.y1,
        x2: h.x2,
        y2: h.y2,
        width: page_width,
        height: page_height,
      },
      rects: [
        {
          x1: h.x1,
          y1: h.y1,
          x2: h.x2,
          y2: h.y2,
          width: page_width,
          height: page_height,
        },
      ],
      pageNumber: h.Page,
    },
    comment: {
      text: "",
      emoji: "",
    },
    id: index.toString(),
  }));
  return highlights;
};
export const convertRawTextToHighlightForContract = async (value) => {
  var highlights = [];
  if (
    value.document_category === "Responsibility Matrix" ||
    value.document_category === "Tender Addendums" ||
    value.document_category === "BOQ"
  ) {
    var h = value;
    highlights.push({
      Text: "",
      content: {
        text: "",
      },
      position: {
        boundingRect: {
          x1: h.x1,
          y1: h.y1,
          x2: h.x2,
          y2: h.y2,
          width: h.page_width,
          height: h.page_height,
        },
        rects: [
          {
            x1: h.x1,
            y1: h.y1,
            x2: h.x2,
            y2: h.y2,
            width: h.page_width,
            height: h.page_height,
          },
        ],
        pageNumber: h.Page,
      },
      comment: {
        text: "",
        emoji: "",
      },
      id: "0",
    });
  } else {
    highlights = value.Raw_Texts.map((h, index) => ({
      Text: "",
      content: {
        text: "",
      },
      position: {
        boundingRect: {
          x1: h.x1,
          y1: h.y1,
          x2: h.x2,
          y2: h.y2,
          width: h.page_width,
          height: h.page_height,
        },
        rects: [
          {
            x1: h.x1,
            y1: h.y1,
            x2: h.x2,
            y2: h.y2,
            width: h.page_width,
            height: h.page_height,
          },
        ],
        pageNumber: h.Page,
      },
      comment: {
        text: "",
        emoji: "",
      },
      id: index.toString(),
    }));
  }
  return highlights;
};
