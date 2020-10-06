const fs = require("fs");
const path = require("path");
const child_process = require("child_process");
const formidable = require("formidable");
const router = require("express").Router();
const buffer = require("buffer");
const inspect = require('util').inspect;
const Dicer = require('dicer');

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
  } else {
    res.end();
  }
});

// router.post("/api/papers", function(req, res) {
//   let myBuffer = Buffer.alloc(buffer.constants.MAX_LENGTH);
//   const written = [];

//   const pdftotext = child_process.spawn('pdftotext',
//     ["-enc", "UTF-8", "-", "-"]);
//   const wc = child_process.spawn('wc', ['-w']);

//   var RE_BOUNDARY = /^multipart\/.+?(?:; boundary=(?:(?:"(.+)")|(?:([^\s]+))))$/i;
//   var m = RE_BOUNDARY.exec(req.headers['content-type']);
//   var d = new Dicer({ boundary: m[1] || m[2] });

//   d.on('part', function(p) {
//     console.log('New part!');
//     p.on('header', function(header) {
//       for (var h in header) {
//         console.log('Part header: k: ' + inspect(h)
//                     + ', v: ' + inspect(header[h]));
//       }
//     });
//     p.on('data', function(data) {
//       console.log('Part data: ' + inspect(data.toString()));
//       const writing = Buffer.from(data);
//       written.push(writing);
//     });
//     p.on('end', function() {
//       console.log('End of part\n');
//     });
//   });
//   d.on('finish', function() {
//     console.log('End of parts');
//     myBuffer = Buffer.concat(written);
//     pdftotext.stdin.write(myBuffer);
//     pdftotext.stdin.end();
//   });
//   req.pipe(d);

//   pdftotext.stdout.on('data', (data) => {
//     console.log(`pdftotext stdout: ${data}`);
//     wc.stdin.write(data);
//   });

//   pdftotext.stderr.on('data', (data) => {
//     console.error(`pdftotext stderr: ${data}`);
//   });

//   pdftotext.on('close', (code) => {
//     if (code !== 0) {
//       console.log(`pdftotext process exited with code ${code}`);
//     }
//     wc.stdin.end();
//   });

//   wc.stdout.on('data', (data) => {
//     const paper = {
//       wordCount: parseInt(data.toString())
//     };
    
//     req.session = paper;
//     console.log("new paper: " + JSON.stringify(paper));
//     res.redirect("/");
//   });
  
//   wc.stderr.on('data', (data) => {
//     console.error(`wc stderr: ${data}`);
//   });
  
//   wc.on('close', (code) => {
//     if (code !== 0) {
//       console.log(`wc process exited with code ${code}`);
//     }
//   });
// });

router.post("/api/papers", function(req, res) {
  const form = formidable({ uploadDir: path.join(__dirname, "../papers") });
  form.parse(req, (err, fields, files) => {
    // pdftotext documentation from Xpdf:
    // https://www.xpdfreader.com/pdftotext-man.html
    const pdftotext = child_process.spawn('pdftotext',
      ["-enc", "UTF-8", files.upload.path]);

    // pdftotext -layout:
    // "Maintain (as best as possible) the original physical layout of the text."
    // const pdftotext = child_process.spawn('pdftotext',
    //   ["-enc", "UTF-8", "-layout", files.upload.path]);

    // pdftotext table mode
    // "Table mode is similar to physical layout mode, but optimized for tabular data,
    // with the goal of keeping rows and columns aligned (at the expense of inserting extra whitespace)."
    // const pdftotext = child_process.spawn('pdftotext',
    //   ["-enc", "UTF-8", "-table", files.upload.path]);

    // pdftotext simple option
    // "Similar to −layout, but optimized for simple one-column pages."
    // const pdftotext = child_process.spawn('pdftotext',
    //   ["-enc", "UTF-8", "-simple", files.upload.path]);

    // pdftotext simple2
    // "Similar to −simple, but handles slightly rotated text (e.g., OCR output) better."
    // const pdftotext = child_process.spawn('pdftotext',
    //   ["-enc", "UTF-8", "-simple2", files.upload.path]);

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
