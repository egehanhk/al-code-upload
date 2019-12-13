# al-code-upload

Tool to ease the upload process of code to Adventure Land

## Getting Started

Put your code files in the `code/` folder. To specify what files you want to upload and where you want to upload them, modify the file `upload_code.js`.

Before you can upload, you will need your auth token for Adventure Land. In the game, go to CONF, toggle pro mode, click "Open Game Inspector". Navigate to "Application" tab. Your auth token is the value of `auth`. Copy that into a file named `.secret`.

To install required dependencies, run `npm install` from a console.

To upload code, run `npm start`
