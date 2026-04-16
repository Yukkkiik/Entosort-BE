// ============================================================
// prisma/seed.js — Seeder Database Awal (Admin User)
// ============================================================

"use strict";

require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Memulai proses seeding database EntoSort...\n");

  // ── 1. Buat Admin User ─────────────────────────────────────
  const adminUsername = "admin";
  const existingAdmin = await prisma.user.findUnique({ where: { username: adminUsername } });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 12);
    const admin = await prisma.user.create({
      data: {
        username: adminUsername,
        password: hashedPassword,
        phone: "+6281234567890",
        role: "ADMIN",
      },
    });
    console.log(`✅ Admin user dibuat: ${admin.email}`);
  } else {
    console.log(`⏭️  Admin user sudah ada: ${adminUsername}`);
  }

  // ── 2. Buat User Standar ───────────────────────────────────
  const operatorUsername = "operator";
  const existingUser = await prisma.user.findUnique({ where: { username: operatorUsername } });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash("operator123", 12);
    const user = await prisma.user.create({
      data: {
        username: operatorUsername,
        password: hashedPassword,
        phone: "+6289876543210",
        role: "OPERATOR",
      },
    });
    console.log(`✅ Operator user dibuat: ${user.username}`);
  } else {
    console.log(`⏭️  Operator user sudah ada`);
  }

  // ── 3. Inisialisasi Settings Default untuk Node ────────────
  const nodes = [
    { nodeId: "rpi-cam-01", nodeType: "CAMERA" },
    { nodeId: "esp32-node-01", nodeType: "MICROCONTROLLER" },
  ];

  for (const node of nodes) {
    // Buat DeviceStatus awal
    await prisma.node.upsert({
      where: { nodeId: node.nodeId },
      update: {},
      create: {
        nodeId: node.nodeId,
        nodeType: node.nodeType,
        status: "OFFLINE",
      },
    });

    // Buat Settings default
    await prisma.settings.upsert({
      where: { nodeId: node.nodeId },
      update: {},
      create: { nodeId: node.nodeId },
    });

    console.log(`✅ Node [${node.nodeType}] diinisialisasi: ${node.nodeId}`);
  }

  // ── 4. Buat Sample Data Sensor (opsional, untuk development) ──
  if (process.env.NODE_ENV === "development") {
    const sampleSensorData = Array.from({ length: 10 }, (_, i) => ({
      nodeId: "esp32-node-01",
      temperature: parseFloat((27 + Math.random() * 5).toFixed(2)),
      humidity: parseFloat((65 + Math.random() * 20).toFixed(2)),
      pressure: parseFloat((1010 + Math.random() * 5).toFixed(2)),
      recordedAt: new Date(Date.now() - i * 5 * 60 * 1000), // Setiap 5 menit ke belakang
    }));

    await prisma.sensorLog.createMany({ data: sampleSensorData });
    console.log(`✅ ${sampleSensorData.length} sample sensor log dibuat.`);

    // Sample Harvest Log
    const sampleHarvest = {
      nodeId: "rpi-cam-01",
      sessionId: "sess-seed-001",
      larvaeCount: 120,
      prepupaCount: 35,
      rejectCount: 5,
      totalCount: 160,
      durationSec: 90,
      notes: "Data awal seeder",
    };
    await prisma.harvestLog.create({ data: sampleHarvest });
    console.log(`✅ Sample harvest log dibuat.`);
  }

  console.log("\n🎉 Seeding selesai!\n");
  console.log("📌 Kredensial default:");
  console.log("   Admin    → admin@entosort.local / Admin@123!");
  console.log("   Operator → operator@entosort.local / Operator@123!");
  console.log("\n⚠️  Segera ganti password default di lingkungan production!\n");
}

main()
  .catch((err) => {
    console.error("❌ Seeding gagal:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });