const express = require('express');

const adminController = require('../controllers/admin');
const isAdmin = require('../middleware/is-admin');

const router = express.Router();

router.get('/panel', adminController.getPanel);

router.post('/panel-login', adminController.postPanelLogin);

router.get('/panel-tips', isAdmin, adminController.getPanelTips);

router.post('/add-tip', isAdmin, adminController.postAddTip);

router.post('/delete-tip', isAdmin, adminController.postDeleteTip);

router.get('/panel-accounts', isAdmin, adminController.getPanelAccounts);

router.post('/accept-account', isAdmin, adminController.postPanelAccountAccept);

router.post('/reject-account', isAdmin, adminController.postPanelAccountReject);

router.get('/panel-table', isAdmin, adminController.getPanelTable);

router.post('/panel-table', isAdmin, adminController.postPanelTable);

module.exports = router;