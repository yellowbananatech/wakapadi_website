const { jsonResponse } = require('./_payment-utils');

exports.handler = async (_event, context) => {
  const country = context.geo?.country?.code ?? null;
  return jsonResponse(200, { country });
};
