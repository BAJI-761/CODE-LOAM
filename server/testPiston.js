const axios = require('axios');
axios.post('https://emkc.org/api/v2/piston/execute', {
  language: 'javascript',
  version: '*',
  files: [{ content: 'console.log("Hello Piston");' }]
}).then(r => console.log(JSON.stringify(r.data, null, 2))).catch(e => console.error(e.response?.data || e.message));
