import express from 'express';
import { APIClient } from '../api/apiclient';
import { Orchestrator } from './Orchestrator';

const router = express.Router();

router.post('/create-tool', async (req, res) => {
  try {
    const { apiServiceTool, specificEndpoint, requiredParams } = req.body;

    if (!apiServiceTool || !specificEndpoint || !requiredParams) {
      return res.status(400).json({ 
        error: 'Missing required fields: apiServiceTool, specificEndpoint, and requiredParams are required' 
      });
    }

    const query = {
      apiServiceTool,
      specificEndpoint,
      requiredParams
    };

    const orchestrator = new Orchestrator();
    const apiResponse = await orchestrator.process(query);
    
    const apiClient = new APIClient('https://us.api.bland.ai/v1');
    
    const response = await apiClient.makeRequest({
      method: 'POST',
      endpoint: '/createTools',
      data: apiResponse,
      additionalHeaders: {
        'Content-Type': 'application/json'
      }
    });

    res.status(200).json({
      message: 'Tool created successfully',
      data: response
    });

  } catch (error) {
    console.error('Error creating tool:', error);
    res.status(500).json({
      error: 'Failed to create tool',
      details: error.message
    });
  }
});

export default router;
