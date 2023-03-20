const DataService = require('../../services/data');
const apiError = require('../../common/api-errors');
const messages = require('../../common/messages');
const ResponseService = require('../../common/response');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const ipfsClient = require('ipfs-http-client');



class DataController {
    async uploadData(req, res) {
        try {
            if (req.files.length === 0 || req.files.length === null) throw new apiError.NotFoundError('files', messages.FILE_IS_MISSING);
            let request = Object.assign({}, req.body);
            console.log(req.files.length);
            let filename = request.filename;
            // Generate a random 256-bit (32-byte) key
            const key = crypto.randomBytes(32);
            // Generate a random 128-bit (16-byte) initialization vector
            const iv = crypto.randomBytes(16);
            const dirpath = 'static/temp/'
            // Read the file to be encrypted
            const data = fs.readFileSync(dirpath + filename);

            // Create a new cipher object
            const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

            // Encrypt the data
            let encrypted = cipher.update(data);
            encrypted = Buffer.concat([encrypted, cipher.final()]);

            // Write the File
            const newFilePath = 'static/uploads/' + filename;
            await fs.writeFileSync(newFilePath, encrypted);

            // Delete File path
            const filePath = dirpath + filename;

            // Delete the original file
            await fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Error deleting file: ${err}`);
                } else {
                    console.log(`Successfully deleted ${filePath}`);
                }
            });
            // Saving file to IPFS
            // const ipfs = ipfsClient();
            // const ipfs2 = new ipfsClient.create({ host: 'localhost', port: '5001', protocol: 'http' });
            const ipfs2 = new ipfsClient.create();
            const fileToUpload = fs.readFileSync(newFilePath);
            const fileBuffer = new Buffer.from(fileToUpload);
            const fileAdded = await ipfs2.add(fileBuffer);

            // Delete the both file
            let files = [filePath, newFilePath]

            await files.forEach(item => {
                fs.unlink(item, (err) => {
                    if (err) {
                        console.error(`Error deleting file: ${err}`);
                    } else {
                        console.log(`Successfully deleted ${newFilePath}`);
                    }
                });
            });


            let stringKey = key.toString('hex')
            let stringIv = iv.toString('hex')

            let info = {
                filename: filename,
                orgname: request.orgname,
                title: request.title,
                description: request.description,
                key: stringKey,
                iv: stringIv,
                ipfsHash: fileAdded.path
            }
            await DataService.storeData(info);
            const allfiles = await DataService.getOwnData()
            return res.status(200).send(ResponseService.success(allfiles));

        } catch (e) {
            return res.status(500).send(ResponseService.failure(e));
        }

    }

    async downloadData(req, res) {
        try {
            let request = Object.assign({}, req.body);
            // Read the key and iv
            const getFileData = await DataService.getOneData({ _id: request.id });
            if (!getFileData) throw "Record Not Found";

            const filepath = 'static/uploads/'

            //Get data from IPFS
            const fileHash = getFileData.ipfsHash;
            const ipfs = new ipfsClient.create();
            const resp = await ipfs.cat(fileHash);
            let content = [];
            for await (const chunk of resp) {
                content = [...content, ...chunk];
            }
            const fileBuffer = await new Buffer.from(content)

            //Write ipfs file to uploads folder
            await fs.writeFileSync(filepath + getFileData.filename, fileBuffer);

            // Read the encrypted file
            const data = await fs.readFileSync(filepath + getFileData.filename);
            // const key = fs.readFileSync('key.txt');
            // const iv = fs.readFileSync('iv.txt');

            // Covert Key and iv into buffer
            let key = Buffer.from(getFileData.key, 'hex')
            let iv = Buffer.from(getFileData.iv, 'hex')

            // Create a new decipher object
            const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

            // Decrypt the data
            let decrypted = decipher.update(data);
            decrypted = Buffer.concat([decrypted, decipher.final()]);

            // Write the decrypted data to a new file
            const dirpath = 'static/temp/'

            fs.writeFileSync(dirpath + getFileData.filename, decrypted);

            var url = dirpath + getFileData.filename

            const stream = fs.createReadStream(url);
            res.set({
                'Content-Disposition': `attachment; filename='${getFileData.filename}'`,
                'Content-Type': 'application/pdf',

            });
            await stream.pipe(res);
            let tempfile = dirpath + getFileData.filename;
            let uploadsdfile = filepath + getFileData.filename;
            let files = [tempfile, uploadsdfile]
            // Delete the file
            await files.forEach(item => {
                fs.unlink(item, (err) => {
                    if (err) {
                        return console.error(`Error deleting file: ${err}`);
                    } else {
                        return console.log(`Successfully deleted ${dirpath}`);
                    }
                });
            });

            // return res.status(200).send(ResponseService.success(encryptInfo));
            return;
        } catch (e) {
            return res.status(500).send(ResponseService.failure(e));
        }

    }

    async getOwnData(req, res) {
        try {
            let request = Object.assign({}, req.body);

            const data = await DataService.getOwnData();
            return res.status(200).send(ResponseService.success(data));

        } catch (e) {
            return res.status(500).send(ResponseService.failure(e));
        }

    }
}
module.exports = new DataController();