import firebase from '../../infrastructure/db/firebase';
import { v4 as uuidv4 } from 'uuid';
const BUCKET_NAME = `${process.env.PROJECT_ID}.appspot.com`;
export default async function handler(req: any, res: any): Promise<any> {
  if (req.method === 'POST') {
    const { user_id } = req.session.user;
    if (!req.files || !req.files.length) {
      res.status(400).send('Error: No files found');
    } else {
      const urls: string[] = [];

      function handleUploadFile(file: any): Promise<string> {
        return new Promise((resolve, reject) => {
          const firebaseStorageDownloadTokens = uuidv4();
          const fileName = `${new Date().getTime()}-${file.originalname}`;
          const blob = firebase.storage().bucket().file(`file/${user_id}/${fileName}`);
          const blobWriter = blob.createWriteStream({
            metadata: {
              contentType: file.mimetype,
              metadata: {
                firebaseStorageDownloadTokens,
              },
            },
            public: true,
          });

          blobWriter.on('error', err => {
            res.status(400).json({ error: err });
          });

          blobWriter.on('finish', () => {
            const url = [
              'https://firebasestorage.googleapis.com/v0/b/',
              BUCKET_NAME,
              `/o/file%2F${user_id}%2F${fileName}?alt=media&token=`,
              firebaseStorageDownloadTokens,
            ].join('');
            resolve(url);
          });
          blobWriter.on('error', reject);
          blobWriter.end(file.buffer);
        });
      }
      async function uploadFile() {
        for (let i = 0; i < req.files.length; i++) {
          const url = await handleUploadFile(req.files[i]);
          urls.push(url);
        }
        res.status(200).json({ urls });
      }
      uploadFile();
    }
  } else {
    res.status(400).json({ error: 'Request not found' });
  }
}
