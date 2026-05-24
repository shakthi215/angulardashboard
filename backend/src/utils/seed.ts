import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { Record } from '../models/Record';
import connectDB from './db';

dotenv.config();

const users = [
  {
    userId: 'ADMIN001',
    username: 'superadmin',
    email: 'admin@dashboard.com',
    password: 'Admin@123',
    role: 'Admin' as const,
    department: 'Management',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=superadmin',
    isActive: true,
  },
  {
    userId: 'USR001',
    username: 'john_doe',
    email: 'john@dashboard.com',
    password: 'User@123',
    role: 'General User' as const,
    department: 'Engineering',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    isActive: true,
  },
  {
    userId: 'USR002',
    username: 'jane_smith',
    email: 'jane@dashboard.com',
    password: 'User@123',
    role: 'General User' as const,
    department: 'Marketing',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
    isActive: true,
  },
  {
    userId: 'USR003',
    username: 'alice_wong',
    email: 'alice@dashboard.com',
    password: 'User@123',
    role: 'General User' as const,
    department: 'HR',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
    isActive: false,
  },
  {
    userId: 'ADMIN002',
    username: 'bob_admin',
    email: 'bob@dashboard.com',
    password: 'Admin@123',
    role: 'Admin' as const,
    department: 'IT',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
    isActive: true,
  },
];

const records = [
  {
    recordId: 'REC-001',
    title: 'Q4 Revenue Analysis',
    description: 'Comprehensive analysis of Q4 revenue streams and projections for next fiscal year.',
    status: 'Active' as const,
    priority: 'High' as const,
    accessLevel: 'Public' as const,
    assignedTo: 'john_doe',
    category: 'Finance',
    tags: ['revenue', 'Q4', 'analysis'],
    dueDate: new Date('2025-03-31'),
    completionPercentage: 65,
    createdBy: 'superadmin',
  },
  {
    recordId: 'REC-002',
    title: 'Infrastructure Security Audit',
    description: 'Full security audit of cloud infrastructure including vulnerability assessment.',
    status: 'Pending' as const,
    priority: 'Critical' as const,
    accessLevel: 'Confidential' as const,
    assignedTo: 'bob_admin',
    category: 'Security',
    tags: ['security', 'audit', 'infrastructure'],
    dueDate: new Date('2025-02-15'),
    completionPercentage: 20,
    createdBy: 'superadmin',
  },
  {
    recordId: 'REC-003',
    title: 'Product Launch Campaign',
    description: 'Marketing campaign for the new product launch targeting enterprise clients.',
    status: 'Active' as const,
    priority: 'High' as const,
    accessLevel: 'Restricted' as const,
    assignedTo: 'jane_smith',
    category: 'Marketing',
    tags: ['campaign', 'product', 'launch'],
    dueDate: new Date('2025-04-01'),
    completionPercentage: 45,
    createdBy: 'superadmin',
  },
  {
    recordId: 'REC-004',
    title: 'Employee Onboarding Process',
    description: 'Streamlined onboarding process for new hires across all departments.',
    status: 'Resolved' as const,
    priority: 'Medium' as const,
    accessLevel: 'Public' as const,
    assignedTo: 'alice_wong',
    category: 'HR',
    tags: ['onboarding', 'HR', 'process'],
    dueDate: new Date('2025-01-31'),
    completionPercentage: 100,
    createdBy: 'superadmin',
  },
  {
    recordId: 'REC-005',
    title: 'Database Migration Plan',
    description: 'Migration plan for transitioning legacy databases to cloud infrastructure.',
    status: 'Pending' as const,
    priority: 'Critical' as const,
    accessLevel: 'Confidential' as const,
    assignedTo: 'bob_admin',
    category: 'Engineering',
    tags: ['database', 'migration', 'cloud'],
    dueDate: new Date('2025-05-15'),
    completionPercentage: 10,
    createdBy: 'superadmin',
  },
  {
    recordId: 'REC-006',
    title: 'Customer Feedback Report',
    description: 'Aggregated customer feedback from surveys conducted in Q3.',
    status: 'Resolved' as const,
    priority: 'Low' as const,
    accessLevel: 'Public' as const,
    assignedTo: 'jane_smith',
    category: 'Customer Success',
    tags: ['feedback', 'survey', 'customers'],
    dueDate: new Date('2025-01-20'),
    completionPercentage: 100,
    createdBy: 'superadmin',
  },
  {
    recordId: 'REC-007',
    title: 'API Rate Limiting Strategy',
    description: 'Design and implement rate limiting strategy for external API consumers.',
    status: 'Active' as const,
    priority: 'Medium' as const,
    accessLevel: 'Restricted' as const,
    assignedTo: 'john_doe',
    category: 'Engineering',
    tags: ['API', 'rate-limiting', 'architecture'],
    dueDate: new Date('2025-03-01'),
    completionPercentage: 55,
    createdBy: 'superadmin',
  },
  {
    recordId: 'REC-008',
    title: 'Annual Compliance Review',
    description: 'Yearly review of compliance with industry regulations and internal policies.',
    status: 'Pending' as const,
    priority: 'High' as const,
    accessLevel: 'Confidential' as const,
    assignedTo: 'superadmin',
    category: 'Legal',
    tags: ['compliance', 'legal', 'annual'],
    dueDate: new Date('2025-06-30'),
    completionPercentage: 5,
    createdBy: 'superadmin',
  },
  {
    recordId: 'REC-009',
    title: 'UX Redesign Initiative',
    description: 'Complete redesign of user experience across all customer-facing applications.',
    status: 'Active' as const,
    priority: 'High' as const,
    accessLevel: 'Public' as const,
    assignedTo: 'jane_smith',
    category: 'Design',
    tags: ['UX', 'redesign', 'frontend'],
    dueDate: new Date('2025-07-01'),
    completionPercentage: 30,
    createdBy: 'superadmin',
  },
  {
    recordId: 'REC-010',
    title: 'Cost Optimization Report',
    description: 'Analysis of cloud spending and recommendations for cost reduction.',
    status: 'Closed' as const,
    priority: 'Medium' as const,
    accessLevel: 'Restricted' as const,
    assignedTo: 'bob_admin',
    category: 'Finance',
    tags: ['cost', 'optimization', 'cloud'],
    dueDate: new Date('2024-12-31'),
    completionPercentage: 100,
    createdBy: 'superadmin',
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting database seed...');

    // Clear existing data
    await User.deleteMany({});
    await Record.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Seed users
    for (const userData of users) {
      await User.create(userData);
    }
    console.log(`✅ Seeded ${users.length} users`);

    // Seed records
    await Record.insertMany(records);
    console.log(`✅ Seeded ${records.length} records`);

    console.log('\n🎉 Database seeded successfully!\n');
    console.log('📋 Test Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin   → userId: ADMIN001 | password: Admin@123');
    console.log('User    → userId: USR001   | password: User@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedDatabase();
