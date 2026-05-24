import { Response } from 'express';
import { Record } from '../models/Record';
import { AuthRequest } from '../middleware/auth.middleware';

export const getRecords = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { page = 1, limit = 10, status, priority, search } = req.query;
    const userRole = req.user?.role;

    // Access level filter based on role
    const accessFilter: Record<string, unknown> = {};
    if (userRole === 'General User') {
      // General users can only see Public and Restricted records
      accessFilter['accessLevel'] = { $in: ['Public', 'Restricted'] };
    }
    // Admins can see all records including Confidential

    // Build dynamic filter
    const filter: Record<string, unknown> = { ...accessFilter };
    if (status) filter['status'] = status;
    if (priority) filter['priority'] = priority;
    if (search) {
      filter['$or'] = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const [records, total] = await Promise.all([
      Record.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Record.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        records,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
        accessLevel: userRole === 'Admin' ? 'Full Access' : 'Restricted Access',
      },
    });
  } catch (error) {
    console.error('Get records error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch records.' });
  }
};

export const getRecordById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const record = await Record.findById(id);

    if (!record) {
      res.status(404).json({ success: false, message: 'Record not found.' });
      return;
    }

    // Access control check
    if (req.user?.role === 'General User' && record.accessLevel === 'Confidential') {
      res.status(403).json({
        success: false,
        message: 'Access denied. Confidential record.',
      });
      return;
    }

    res.status(200).json({ success: true, data: { record } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch record.' });
  }
};

export const getDashboardStats = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userRole = req.user?.role;
    const accessFilter =
      userRole === 'General User'
        ? { accessLevel: { $in: ['Public', 'Restricted'] } }
        : {};

    const [statusStats, priorityStats, totalRecords] = await Promise.all([
      Record.aggregate([
        { $match: accessFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Record.aggregate([
        { $match: accessFilter },
        { $group: { _id: '$priority', count: { $sum: 1 } } },
      ]),
      Record.countDocuments(accessFilter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalRecords,
        statusBreakdown: statusStats,
        priorityBreakdown: priorityStats,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch stats.' });
  }
};
