const fs = require("fs");
const path = require("path");
const child_process = require("child_process");
const formidable = require("formidable");
const router = require("express").Router();

router.get("/api/papers", function(req, res) {
  if (req.session.path) {
    fs.readFile(req.session.path + ".txt", "utf8", (err, data) => {
      if (err) throw err;
      
      const paper = {
        fileName: req.session.fileName,
        parsedPDF: data,
        wordCount: req.session.wordCount
      };

      res.json(paper);
    });
  } else if (req.session.fileUploadType) {
    const fileUploadType = req.session.fileUploadType;
    req.session = null;
    res.json({ fileUploadType: fileUploadType });
  } else {
    res.end();
  }
});

router.post("/api/papers", function(req, res) {
  const form = formidable({ uploadDir: path.join(__dirname, "../papers") });
  form.parse(req, (err, fields, files) => {
    if (files.upload.type !== "application/pdf") {
      const rm_file = child_process.spawn('rm', [files.upload.path]);
  
      rm_file.on('close', (code) => {
        if (code !== 0) {
          console.log(`rm_file process exited with code ${code}`);
        }
      });

      req.session.fileUploadType = files.upload.type;
      res.redirect("/");
      return;
    }
    
    // pdftotext documentation from Xpdf:
    // https://www.xpdfreader.com/pdftotext-man.html

    // pdftotext -layout:
    // "Maintain (as best as possible) the original physical layout of the text."
    const pdftotext = child_process.spawn('pdftotext',
      ["-enc", "UTF-8", "-layout", files.upload.path]);

    pdftotext.stdout.on('data', (data) => {
      console.log(`pdftotext stdout: ${data}`);
    });
    
    pdftotext.stderr.on('data', (data) => {
      console.error(`pdftotext stderr: ${data}`);
    });
    
    pdftotext.on('close', (code) => {
      if (code !== 0) {
        console.log(`pdftotext process exited with code ${code}`);
      }
      
      const wc = child_process.spawn('wc', [files.upload.path + ".txt", '-w']);
      
      wc.stdout.on('data', (data) => {
        const paper = {
          fileName: files.upload.name,
          path: files.upload.path,
          wordCount: parseInt(data.toString())
        };
        
        req.session = paper;
        console.log("new paper: " + JSON.stringify(paper));
        res.redirect("/");
      });
      
      wc.stderr.on('data', (data) => {
        console.error(`wc stderr: ${data}`);
      });
      
      wc.on('close', (code) => {
        if (code !== 0) {
          console.log(`wc process exited with code ${code}`);
        }
      });  
    });    
  });
});

router.delete("/api/papers", function(req, res) {
  const rm_pdf = child_process.spawn('rm', [req.session.path]);
  
  rm_pdf.on('close', (code) => {
    if (code !== 0) {
      console.log(`rm_pdf process exited with code ${code}`);
    }

    const rm_txt = child_process.spawn('rm', [req.session.path + ".txt"]);
    
    rm_txt.on('close', (code) => {
      if (code !== 0) {
        console.log(`rm_txt process exited with code ${code}`);
      }

      req.session = null;
      console.log("cookie session destroyed/req.session set back to empty");
      res.end();
    });
  });
});

router.use(function(req, res) {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

module.exports = router;
