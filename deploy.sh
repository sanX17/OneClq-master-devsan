#!/bin/bash
cd /home/admin/OneclqWeb

echo "Pulling latest code"
git pull origin master

echo "Installing dependencies"
npm ci

echo "Building Next.js"
npm run build

echo "Restarting PM2"
pm2 restart oneclq
