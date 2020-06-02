const fs = require("fs");
const crypto = require("crypto");

const upload = require("./tools/upload.js");

const hash_file = "code_hashes.json";

/**
 * Change this for files to save 
 */
const save_map = {
    "code/test.js": {slot: 60, name: "test"},
    "code/test2.js": {slot: 61, name: "test2"}
};


/**
 * Check checksum of files to avoid uploading unchanged files
 */
function checksum(file_path) {
    const file_content = fs.readFileSync(file_path).toString();
    return crypto.createHash("md5").update(file_content, 'utf8').digest("hex");
}


// Function to check file checksums and upload if it's changed
async function upload_changed_files() {
    // Get the last hashes
    let code_hashes = {};
    if (fs.existsSync(hash_file)) {
        code_hashes = JSON.parse(fs.readFileSync(hash_file));
    }

    let found_change = false;

    // Upload files that has changed
    for (const file_path in save_map) {
        const file_checksum = checksum(file_path);
        if (code_hashes[file_path] !== file_checksum) {
            found_change = true;
            const slot = save_map[file_path].slot;
            const name = save_map[file_path].name;

            console.log(`Checksum changed in file ${file_path}`);
            let upload_result;
            try {
                upload_result = await upload(file_path, slot, name);
            } catch(error) {
                console.log(`Error uploading ${file_path} with reason: ${JSON.stringify(reason)}`);
                continue;
            }
            const json_data = await upload_result.json();
            const message_objects = json_data.filter(e=>e.type && e.type === "message"); // Hopefully there's only one with element type === "message"
            if (message_objects[0]) {
                console.log(`Uploaded ${file_path} to save slot ${slot} with name ${name}`);
                console.log(`${message_objects[0].message}`);

                // Store the new checksum
                code_hashes[file_path] = file_checksum;
            } else {
                console.log(`Error during upload. Server responded with ${json_data[0].type}`);
                console.log("Full response:");
                console.log(json_data);
            }
        }
    }

    if (!found_change) {
        console.log("No changes found in the specified files");
    }

    // Store new checksum hashes
    fs.writeFileSync(hash_file, JSON.stringify(code_hashes));
}

upload_changed_files();