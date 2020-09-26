import React from 'react';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';

const stackTokens = {
  childrenGap: 4,
  maxWidth: "100%"
};

function Count(props) {
  return (
    <div className="count ms-depth-64">
      <h5>Word count</h5>
      <div>
        <Stack horizontal verticalAlign="center" tokens={stackTokens}>
          <Label>File name:</Label>
          <span>{props.fileName}</span>
        </Stack>
        <Stack horizontal verticalAlign="center" tokens={stackTokens}>
          <Label>Word count*:</Label>
          <span>{props.wordCount}</span>
        </Stack>
        <Stack horizontal verticalAlign="center" tokens={stackTokens}>
          <Label>Text from .PDF:</Label>
          <span>{props.isParsing ? <Spinner label="Parsing..." /> : ""}</span>
        </Stack>
        {props.parsedPDF ?
        <div className="parsed ms-fontSize-12">{props.parsedPDF}</div> : ""}
        <div className="ms-fontSize-12">
          *Word count is computed by first converting the .PDF file to text using the <span className="command">pdftotext</span> command-line utility, and then running the <span className="command">wc -w</span> command on the output .TXT file
        </div>
      </div>
    </div>
  );
};

export default Count;
