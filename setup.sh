#!/bin/bash
# NexusDash Setup Script
set -e

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║       NexusDash — Setup Script           ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# ── Backend ──────────────────────────────────────────────────
echo "📦 Installing backend dependencies..."
cd backend
npm install

if [ ! -f .env ]; then
  cp .env.example .env
  echo ""
  echo "⚠️  Created backend/.env from .env.example"
  echo "   → Please edit backend/.env and set your MONGODB_URI"
  echo ""
else
  echo "✅ backend/.env already exists"
fi

cd ..

# ── Frontend ─────────────────────────────────────────────────
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║       Setup Complete! 🎉                 ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo ""
echo "  1. Edit backend/.env  →  set MONGODB_URI"
echo ""
echo "  2. Seed the database:"
echo "     cd backend && npm run seed"
echo ""
echo "  3. Start backend (terminal 1):"
echo "     cd backend && npm run dev"
echo ""
echo "  4. Start frontend (terminal 2):"
echo "     cd frontend && npm start"
echo ""
echo "  5. Open:  http://localhost:4200"
echo ""
echo "  Demo credentials:"
echo "     Admin → ADMIN001 / Admin@123"
echo "     User  → USR001   / User@123"
echo ""
