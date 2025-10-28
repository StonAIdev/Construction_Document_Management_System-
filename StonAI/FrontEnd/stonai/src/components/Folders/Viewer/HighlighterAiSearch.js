import React, { Component } from "react";

import {
  PdfLoader,
  PdfHighlighter,
  Tip,
  Highlight,
  Popup,
  AreaHighlight
} from "react-pdf-highlighter";


import Spinner from "./Spinner";
import "./style/AreaHighlight.css";
import "./style/HighlightAiSearch.css"
import "./style/MouseSelection.css";
import "./style/pdf_viewer.css";
import "./style/Tip.css";
import "./style/PdfHighlighter.css";
import { border } from "@material-ui/system";
import { updateHash } from "./DocumentExtraction/DocumentExtraction";
import {Button,IconButton} from "@mui/material"
import {ZoomIn,ZoomOut} from '@mui/icons-material';
const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () =>
  document.location.hash.slice("#highlight-".length);

const resetHash = () => {
  document.location.hash = "";
};

const HighlightPopup = ({ comment }) =>
  comment.text ? (
    <div className="Highlight__popup">
      {comment.emoji} {comment.text}
    </div>
  ) : null;

const PRIMARY_PDF_URL = "https://arxiv.org/pdf/1708.08021.pdf";
const SECONDARY_PDF_URL = "https://arxiv.org/pdf/1604.02480.pdf";
const highlights = [
  {
    Text:"Client",
    content: {
      text:"Client"
    },
    position: {
      boundingRect:{
        x1: 145.09927959740162,
        y1: 151.99062551558018,
        x2: 326.64179185032845,
        y2: 179.061577892862263,
        width: 1654,
        height: 2339
      },
      rects: [
        {
          x1: 145.09927959740162,
          y1: 151.99062551558018,
          x2: 326.64179185032845,
          y2: 179.061577892862263,
          width: 1654,
          height: 2339
        },
      ],
      pageNumber: 1
    },
    comment: {
      text: '',
      emoji: ''
    },
    id: "0"
  }
];
const searchParams = new URLSearchParams(document.location.search);

const initialUrl = searchParams.get("url") || PRIMARY_PDF_URL;
var PDF_DOC_SCALE = 1;
class HighlighterAiSearch extends Component {
  state = {
    url: this.props.docUrl,
    highlights: this.props.highlights??highlights,
    isAiSearch: this.props.isAiSearch,
    zoomLevel:"auto"
  };

  resetHighlights = () => {
    this.setState({
      highlights: []
    });
  };


  scrollViewerTo = (highlight: any) => {};

  scrollToHighlightFromHash = () => {
    const highlight = this.getHighlightById(parseIdFromHash());

    if (highlight) {
      this.scrollViewerTo(highlight);
    }
  };

  componentDidMount() {
    window.addEventListener(
      "hashchange",
      this.scrollToHighlightFromHash,
      false
    );
    console.log("this.props.highlights??highlights",this.props.highlights??highlights)
    if(this.state.isAiSearch){
      updateHash(0);
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.zoomLevel != this.state.zoomLevel) {
      window.PdfViewer.viewer.currentScaleValue = this.state.zoomLevel;
    }
  }
  getHighlightById(id) {
    const { highlights } = this.state;

    return highlights.find((highlight) => highlight.id === id);
  }

  addHighlight(highlight) {
    const { highlights } = this.state;

    console.log("Saving highlight", highlight);

    this.setState({
      highlights: [{ ...highlight, id: getNextId() }, ...highlights]
    });
  }

  updateHighlight(highlightId, position, content) {
    console.log("Updating highlight", highlightId, position, content);

    this.setState({
      highlights: this.state.highlights.map((h) => {
        const {
          id,
          position: originalPosition,
          content: originalContent,
          ...rest
        } = h;
        return id === highlightId
          ? {
              id,
              position: { ...originalPosition, ...position },
              content: { ...originalContent, ...content },
              ...rest
            }
          : h;
      })
    });
  }
  handlePDFZoomIn = () => {
    PDF_DOC_SCALE += 0.25;
   if (PDF_DOC_SCALE > 10) PDF_DOC_SCALE = 10;

   this.setState((prevState) => ({
     ...prevState,
     zoomLevel: PDF_DOC_SCALE,
   }));
 };
 handlePDFZoomOut = () => {
    PDF_DOC_SCALE -= 0.25;
   if (PDF_DOC_SCALE == 0) PDF_DOC_SCALE = 0.25;

   this.setState((prevState) => ({
     ...prevState,
     zoomLevel: PDF_DOC_SCALE,
   }));
 };
  render() {
    const { url, highlights,searchValue } = this.state;

    return (
      <div className="Highlighter" style={{ display: "flex", height: "75vh" }}>
        <div
          style={{
            width: "100%",
            position: "relative",
          }}
          className="highlight1"
        >
            <IconButton aria-label="Zoom Out" onClick={this.handlePDFZoomOut}>
              <ZoomOut/>
            </IconButton>
            <IconButton aria-label="Zoom In" onClick={this.handlePDFZoomIn}>
              <ZoomIn/>
            </IconButton>
          <PdfLoader url={url} beforeLoad={<Spinner />}>
            {(pdfDocument) => (
              <PdfHighlighter
                pdfDocument={pdfDocument}
                enableAreaSelection={(event) => event.altKey}
                onScrollChange={resetHash}
                searchValue={"Subcontract Agreemen"}
                pdfScaleValue={this.state.zoomLevel}
                scrollRef={(scrollTo) => {
                  console.log("scrollTo",scrollTo)
                  this.scrollViewerTo = scrollTo;

                  this.scrollToHighlightFromHash();
                }}
                onSelectionFinished={(
                  position,
                  content,
                  hideTipAndSelection,
                  transformSelection
                ) => (
                  <Tip
                    onOpen={transformSelection}
                    onConfirm={(comment) => {
                      this.addHighlight({ content, position, comment });

                      hideTipAndSelection();
                    }}
                  />
                )}
                highlightTransform={(
                  highlight,
                  index,
                  setTip,
                  hideTip,
                  viewportToScaled,
                  screenshot,
                  isScrolledTo
                ) => {
                  const isTextHighlight = !Boolean(
                    highlight.content && highlight.content.image
                  );

                  const component = isTextHighlight ? (
                    <Highlight
                      isScrolledTo={isScrolledTo}
                      position={highlight.position}
                      comment={highlight.comment}
                    />
                  ) : (
                    <AreaHighlight
                      highlight={highlight}
                      onChange={(boundingRect) => {
                        this.updateHighlight(
                          highlight.id,
                          { boundingRect: viewportToScaled(boundingRect) },
                          { image: screenshot(boundingRect) }
                        );
                      }}
                    />
                  );

                  return (
                    <Popup
                      popupContent={<HighlightPopup {...highlight} />}
                      onMouseOver={(popupContent) =>
                        setTip(highlight, (highlight) => popupContent)
                      }
                      onMouseOut={hideTip}
                      key={index}
                      children={component}
                    />
                  );
                }}
                highlights={highlights}
              />
            )}
          </PdfLoader>
        </div>
      </div>
    );
  }
}

export default HighlighterAiSearch;
