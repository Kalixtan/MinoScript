#!/usr/bin/env node

/* 

creates a highly compressed release build in bin of the contents of src

packages used:

npm i tar  html-minifier-terser ycssmin  google-closure-compiler concat  pngcrush-bin inliner ncp rimraf gifsicle terser gzipper  
*/

var fs = require("fs");

/* Read and increment build number
   =============================== */
var lines = fs.readFileSync(".build/buildnumber.txt",encoding='utf-8');
var buildnum = parseInt(lines);
buildnum++;
fs.writeFileSync(".build/buildnumber.txt",buildnum.toString(),encoding='utf-8');


//#node-qunit-phantomjs  tests/tests.html --timeout 40
console.log("===========================");
console.log('build number '+buildnum)

var start = new Date()

// console.log("clearing whitepsace from demos")
// cd demo
// find . -type f \( -name "*.txt" \) -exec perl -p -i -e "s/[ \t]*$//g" {} \;
// cd ..

console.log("removing bin")


fs.rmdirSync("./bin", { recursive: true });

fs.mkdirSync('./bin');

console.log("inlining standalone template")

var Inliner = require('inliner');

new Inliner('./src/standalone.html', function (error, html) {
  // compressed and inlined HTML page
  fs.writeFileSync("./src/standalone_inlined.txt", html, 'utf8');

  console.log("Copying files")
  var ncp = require('ncp').ncp;
  ncp.limit = 16;
  ncp("./src", "./bin/", function (err) {
    if (err) {
      return console.error(err);
    }
    console.log("echo optimizing pngs");

    const rimraf = require('rimraf');
    rimraf.sync('./bin/images/*.png');

    const imagemin = require('imagemin');
    const imageminPngcrush = require('imagemin-pngcrush');

    (async () => {
        await imagemin(['./src/images/*.png'], {
            destination: './bin/images/',
            plugins: [
                imageminPngcrush(["-brute","-reduce","-rem allb"])
            ]
        });
    


        const {execFileSync} = require('child_process');
        const gifsicle = require('gifsicle');
        
    })();

    });


});


/*
echo gzipping site
cd ../bin
./gzipper
rm README.md
rm gzipper
rm commit
cd ../src
end=`date +%s`
runtime=$((end-start))
time=`date "+%H:%M:%S"`
echo script end time : $time 
echo script took $runtime seconds
echo ===========================
*/