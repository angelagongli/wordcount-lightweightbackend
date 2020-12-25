import React, { useState, useEffect } from 'react';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { PrimaryButton } from 'office-ui-fabric-react';

const columnProps = {
    tokens: { childrenGap: 10 },
    styles: { root: { width: "100%" } }
};

function Form(props) {
    const [file, setFile] = useState(undefined);
    const [errorMessage, setErrorMessage] = useState("");

    const handleFileSelect = (event) => {
        setFile(event.target.files[0]);
    }

    useEffect(() => {
        if (props.fileUploadType) {
            setErrorMessage(`Your file is of MIME type ${props.fileUploadType}. Please upload your paper in .PDF form.`);
        }
    });

    function uploadPDF(event) {
        if (file) {
            if (errorMessage) {
                setErrorMessage("");
            }
            props.updateUpload(file);
        } else {
            event.preventDefault();
            setErrorMessage("Please upload your paper.");
        }
    }

    return (
        <div className="form ms-depth-64">
            <h5>Upload your paper</h5>
            <form action="/api/papers" encType="multipart/form-data" method="post">
                <Stack {...columnProps}>
                    <Label htmlFor="upload" required>Upload your paper as .PDF file:</Label>
                    <input type="file" accept=".pdf" id="upload" name="upload" onChange={handleFileSelect} />
                    <PrimaryButton type="submit" text="Upload" id="upload-btn" onClick={uploadPDF} />
                    <span className="message ms-fontSize-12">{errorMessage}</span>
                </Stack>
            </form>
        </div>
    );
};

export default Form;
