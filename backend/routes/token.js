const express = require('express');
const router = express.Router();
const { ethers } = require('ethers');

const provider = new ethers.providers.JsonRpcProvider(process.env.MASCHAIN_RPC_URL);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, [
    "function mint(address to, uint256 amount) external",
    "function transfer(address to, uint256 amount) external"
], provider.getSigner());

// Mint token
router.post('/mint', async (req, res) => {
    const { walletAddress, amount } = req.body;
    try {
        await contract.mint(walletAddress, ethers.utils.parseUnits(amount, 'ether'));
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to mint token' });
    }
});

// Transfer token
router.post('/token-transfer', async (req, res) => {
    const { from, to, amount } = req.body;
    try {
        await contract.transfer(to, ethers.utils.parseUnits(amount, 'ether'));
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to transfer token' });
    }
});

module.exports = router;
