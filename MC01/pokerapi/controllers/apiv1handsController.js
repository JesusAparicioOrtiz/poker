'use strict'

var varapiv1handsController = require('./apiv1handsControllerService');

module.exports.obtainVerdict = function obtainVerdict(req, res, next) {
  varapiv1handsController.obtainVerdict(req.swagger.params, res, next);
};

module.exports.corsSupport = function corsSupport(req, res, next) {
  varapiv1handsController.corsSupport(req.swagger.params, res, next);
};