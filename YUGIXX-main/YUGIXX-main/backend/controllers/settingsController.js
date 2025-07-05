const Settings = require('../models/Settings');

// Get user settings
exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({ userId: req.user._id });
    
    if (!settings) {
      // Create default settings if none exist
      settings = await Settings.create({
        userId: req.user.id,
        theme: 'light',
      notifications: true,
      autoSave: true,
      timeout: 30000
      });
    }
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings', error: error.message });
  }
};

// Update user settings
exports.updateSettings = async (req, res) => {
  try {
    console.log(req.body);
    const settings = await Settings.findOneAndUpdate(
      { userId: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error updating settings', error: error.message });
  }
};

exports.addEnvironment = async (req, res) => {
  try {
    const { name, variables } = req.body;

    const settings = await Settings.findOne({ userId: req.user.id });

    if (!settings) {
      return res.status(404).json({
        success: false,
        error: 'Settings not found'
      });
    }

    // Check for duplicate environment name
    const exists = settings.environments.some(env => env.name === name);
    if (exists) {
      return res.status(400).json({
        success: false,
        error: 'Environment with this name already exists'
      });
    }

    settings.environments.push({
      name,
      variables: new Map(Object.entries(variables || {}))
    });

    await settings.save();

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.updateEnvironment = async (req, res) => {
  try {
    const { name, variables } = req.body;
    const envId = req.params.id;

    const settings = await Settings.findOne({ userId: req.user.id });

    if (!settings) {
      return res.status(404).json({
        success: false,
        error: 'Settings not found'
      });
    }

    const envIndex = settings.environments.findIndex(env => env._id.toString() === envId);
    if (envIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Environment not found'
      });
    }

    settings.environments[envIndex] = {
      _id: settings.environments[envIndex]._id,
      name: name || settings.environments[envIndex].name,
      variables: new Map(Object.entries(variables || {}))
    };

    await settings.save();

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.deleteEnvironment = async (req, res) => {
  try {
    const envId = req.params.id;

    const settings = await Settings.findOne({ userId: req.user.id });

    if (!settings) {
      return res.status(404).json({
        success: false,
        error: 'Settings not found'
      });
    }

    settings.environments = settings.environments.filter(
      env => env._id.toString() !== envId
    );

    await settings.save();

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}; 