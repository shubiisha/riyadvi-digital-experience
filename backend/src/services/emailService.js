const env = require('../config/env');

const emailService = {
  async sendContactNotification(enquiry) {
    console.log(`[EMAIL DISPATCH] New Contact Enquiry received from ${enquiry.name} <${enquiry.email}> for ${enquiry.requirement}. Sent notification to ${env.ADMIN_EMAIL}`);
    return { success: true, messageId: 'sim_msg_' + Date.now() };
  },

  async sendConsultationConfirmation(consultation) {
    console.log(`[EMAIL DISPATCH] Consultation request confirmed for ${consultation.name} on ${consultation.preferredDate || 'TBD'}. Email dispatched to ${consultation.email}`);
    return { success: true };
  },

  async sendHealthCheckupReport(lead) {
    console.log(`[EMAIL DISPATCH] Digital Readiness Audit Report generated for ${lead.companyName} (${lead.digitalReadinessScore}/100). Dispatched to ${lead.email}`);
    return { success: true };
  },

  async sendLeadMagnetLink(lead) {
    console.log(`[EMAIL DISPATCH] Guide download link delivered for '${lead.resourceName}' to ${lead.email}`);
    return { success: true };
  },

  async sendApplicationNotification(application) {
    console.log(`[EMAIL DISPATCH] New Job Application received from ${application.name} for position '${application.position}'. Admin alerted.`);
    return { success: true };
  },
};

module.exports = emailService;
