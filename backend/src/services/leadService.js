const leadService = {
  calculateHealthScore(answers) {
    let score = 50; // base score

    if (answers.hasWebsite === 'Yes') score += 10;
    if (answers.isMobileFriendly === 'Yes') score += 10;
    if (answers.usesCrm === 'Yes') score += 10;
    if (answers.cloudHosting && answers.cloudHosting !== 'None') score += 10;

    const channels = Array.isArray(answers.currentMarketingChannels) ? answers.currentMarketingChannels.length : 0;
    score += Math.min(channels * 3, 10);

    const boundedScore = Math.max(35, Math.min(score, 98));

    let readinessLevel = 'Early Modernization';
    if (boundedScore >= 80) readinessLevel = 'Digital Leader & High Scaler';
    else if (boundedScore >= 65) readinessLevel = 'Accelerated Growth Ready';
    else if (boundedScore >= 50) readinessLevel = 'Modernization Candidate';

    const recommendedServices = [];
    if (answers.hasWebsite !== 'Yes' || answers.isMobileFriendly !== 'Yes') {
      recommendedServices.push('Modern Web & WebApp Development');
    }
    if (channels < 2) {
      recommendedServices.push('Digital Marketing & Growth Engine');
    }
    if (answers.usesCrm !== 'Yes' || answers.cloudHosting === 'None') {
      recommendedServices.push('Enterprise Cloud Architecture & Automation');
    }
    if (recommendedServices.length === 0) {
      recommendedServices.push('Custom 3D Interactive Solutions & AI Integration');
    }

    return {
      digitalReadinessScore: boundedScore,
      readinessLevel,
      recommendedServices,
    };
  },
};

module.exports = leadService;
