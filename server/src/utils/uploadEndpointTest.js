const fs = require('fs');
const path = require('path');
const fetch = global.fetch || require('node-fetch');

async function run() {
  try {
    const imageUrl = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';
    const res = await fetch(imageUrl);
    if (!res.ok) throw new Error('Failed to download sample image');
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { Blob } = global;
    const blob = new Blob([buffer], { type: 'image/jpeg' });

    const FormData = global.FormData || require('form-data');
    const fd = new FormData();
    // If using node-fetch FormData, append expects stream or buffer
    if (fd.append.length === 3) {
      // node-fetch v2 FormData (not likely)
      fd.append('file', buffer, 'temp.jpg');
    } else {
      fd.append('file', blob, 'temp.jpg');
    }

    const uploadRes = await fetch('http://localhost:5000/api/v1/uploads/thumbnail', {
      method: 'POST',
      body: fd,
      headers: fd.getHeaders ? fd.getHeaders() : undefined,
    });

    const json = await uploadRes.json();
    console.log('Upload endpoint response:', json);
  } catch (err) {
    console.error('Test failed:', err.message || err);
    process.exitCode = 2;
  }
}

if (require.main === module) run();
module.exports = run;
