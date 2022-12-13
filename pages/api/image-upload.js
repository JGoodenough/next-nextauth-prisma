import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';
import { decode } from 'base64-arraybuffer';
import { withServerAuth } from '@/lib/server.with-auth';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Export config for this route to allow larger size image uploads.
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default withServerAuth(async function handler(req, res) {
  // Upload image to Supabase
  switch (req.method) {
    case 'POST':
      try {
        const { image } = req.body;

        if (!image) {
          return res.status(400).json({ message: 'No image provided' });
        }
        const contentType = image.match(/data:(.*);base64/)?.[1];
        const base64FileData = image.split('base64,')?.[1];

        if (!contentType || !base64FileData) {
          return res.status(400).json({ message: 'Image data not valid' });
        }

        const fileName = nanoid();
        const ext = contentType.split('/')[1];
        const path = `${fileName}.${ext}`;
        const { data, error: uploadError } = await supabase.storage
          .from(process.env.SUPABASE_BUCKET)
          .upload(path, decode(base64FileData), {
            contentType,
            upsert: true,
          });

        if (uploadError) {
          throw new Error('Unable to upload image to storage');
        }

        const url = `${process.env.SUPABASE_URL.replace(
          '.co',
          '.in'
        )}/storage/v1/object/public/${data.Key}`;

        return res.status(200).json({ url });
      } catch (e) {
        res.status(500).json({ message: 'Something went wrong' });
      }

      break;
    default:
      // HTTP method not supported!
      res.setHeader('Allow', ['POST']);
      res
        .status(405)
        .json({ message: `HTTP method ${req.method} is not supported.` });
  }
});
