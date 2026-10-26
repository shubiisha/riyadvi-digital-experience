const path = require('path');
const fs = require('fs');

const uploadService = {
  processResume(fileOrUrl, candidateName) {
    if (typeof fileOrUrl === 'string' && (fileOrUrl.startsWith('http') || fileOrUrl.startsWith('drive.google'))) {
      return {
        url: fileOrUrl,
        type: 'external_link',
      };
    }

    const safeCandidateName = (candidateName || 'candidate').replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${Date.now()}_${safeCandidateName}_Resume.pdf`;
    
    return {
      url: `/uploads/${filename}`,
      filename,
      type: 'document',
    };
  },
};

module.exports = uploadService;
