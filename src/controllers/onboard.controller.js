import User from '../models/User.model.js';
import { parseNaturalLanguage } from '../services/ai.service.js';

export const onboardNL = async (req, res) => {
  try {
    const { nl_text } = req.body;

    if (!nl_text || nl_text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: { 
          message: 'Natural language text is required', 
          code: 'MISSING_TEXT' 
        }
      });
    }

    // Parse with AI
    const parseResult = await parseNaturalLanguage(nl_text);
    
    if (!parseResult.success) {
      return res.status(500).json({
        success: false,
        error: { 
          message: 'Failed to parse input', 
          code: 'PARSE_ERROR' 
        }
      });
    }

    const parsed = parseResult.data;

    // Update user based on role
    const updateData = {};
    
    if (req.user.role === 'patient') {
      if (parsed.conditions && parsed.conditions.length > 0) {
        updateData.conditions = parsed.conditions;
      }
      if (parsed.keywords && parsed.keywords.length > 0) {
        updateData.keywords = parsed.keywords;
      }
    } else if (req.user.role === 'researcher') {
      if (parsed.specialties && parsed.specialties.length > 0) {
        updateData.specialties = parsed.specialties;
      }
      if (parsed.researchInterests && parsed.researchInterests.length > 0) {
        updateData.researchInterests = parsed.researchInterests;
      }
    }

    if (parsed.location) {
      updateData.location = parsed.location;
    }

    updateData.onboarded = true; // Mark as completed

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true }
    );

    // Format response to match frontend expectations
    const userResponse = {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      profileCompleted: updatedUser.onboarded,
      conditions: updatedUser.conditions || [],
      keywords: updatedUser.keywords || [],
      specialties: updatedUser.specialties || [],
      researchInterests: updatedUser.researchInterests || [],
      location: updatedUser.location || null,
      bio: updatedUser.bio || '',
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    };

    res.json({
      success: true,
      data: {
        parsed,
        updatedProfile: userResponse
      }
    });
  } catch (err) {
    console.error('Onboarding error:', err);
    res.status(500).json({
      success: false,
      error: { 
        message: err.message, 
        code: 'ONBOARD_ERROR' 
      }
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      'name', 'bio', 'location', 'conditions', 'keywords', 
      'specialties', 'researchInterests', 'orcid', 
      'institution', 'availability'
    ];
    
    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    const userResponse = {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      profileCompleted: updatedUser.onboarded,
      conditions: updatedUser.conditions || [],
      keywords: updatedUser.keywords || [],
      specialties: updatedUser.specialties || [],
      researchInterests: updatedUser.researchInterests || [],
      location: updatedUser.location || null,
      bio: updatedUser.bio || '',
      institution: updatedUser.institution || '',
      availability: updatedUser.availability || 'available',
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    };

    res.json({
      success: true,
      data: { user: userResponse }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { message: err.message, code: 'UPDATE_ERROR' }
    });
  }
};