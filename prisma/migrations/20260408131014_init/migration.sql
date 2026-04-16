/*
  Warnings:

  - You are about to drop the `Device` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ErrorLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SensorLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SortingLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Device` DROP FOREIGN KEY `Device_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `ErrorLog` DROP FOREIGN KEY `ErrorLog_device_id_fkey`;

-- DropForeignKey
ALTER TABLE `SensorLog` DROP FOREIGN KEY `SensorLog_device_id_fkey`;

-- DropForeignKey
ALTER TABLE `SortingLog` DROP FOREIGN KEY `SortingLog_device_id_fkey`;

-- DropTable
DROP TABLE `Device`;

-- DropTable
DROP TABLE `ErrorLog`;

-- DropTable
DROP TABLE `SensorLog`;

-- DropTable
DROP TABLE `SortingLog`;

-- DropTable
DROP TABLE `User`;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `role` ENUM('ADMIN', 'OPERATOR') NOT NULL DEFAULT 'OPERATOR',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sensor_logs` (
    `id` VARCHAR(191) NOT NULL,
    `nodeId` VARCHAR(191) NOT NULL,
    `temperature` DOUBLE NOT NULL,
    `humidity` DOUBLE NOT NULL,
    `pressure` DOUBLE NULL,
    `recordedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `sensor_logs_nodeId_idx`(`nodeId`),
    INDEX `sensor_logs_recordedAt_idx`(`recordedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `harvest_logs` (
    `id` VARCHAR(191) NOT NULL,
    `sessionId` VARCHAR(191) NOT NULL,
    `nodeId` VARCHAR(191) NOT NULL,
    `larvaeCount` INTEGER NOT NULL DEFAULT 0,
    `prepupaCount` INTEGER NOT NULL DEFAULT 0,
    `rejectCount` INTEGER NOT NULL DEFAULT 0,
    `totalCount` INTEGER NOT NULL DEFAULT 0,
    `durationSec` INTEGER NULL,
    `notes` VARCHAR(191) NULL,
    `recordedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `harvest_logs_nodeId_idx`(`nodeId`),
    INDEX `harvest_logs_sessionId_idx`(`sessionId`),
    INDEX `harvest_logs_recordedAt_idx`(`recordedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `device_statuses` (
    `id` VARCHAR(191) NOT NULL,
    `nodeId` VARCHAR(191) NOT NULL,
    `nodeType` ENUM('CAMERA', 'MICROCONTROLLER') NOT NULL,
    `status` ENUM('ONLINE', 'OFFLINE') NOT NULL DEFAULT 'OFFLINE',
    `ipAddress` VARCHAR(191) NULL,
    `firmwareV` VARCHAR(191) NULL,
    `lastSeen` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `device_statuses_nodeId_key`(`nodeId`),
    INDEX `device_statuses_nodeId_idx`(`nodeId`),
    INDEX `device_statuses_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `settings` (
    `id` VARCHAR(191) NOT NULL,
    `nodeId` VARCHAR(191) NOT NULL,
    `hsvLowerH` INTEGER NOT NULL DEFAULT 0,
    `hsvLowerS` INTEGER NOT NULL DEFAULT 0,
    `hsvLowerV` INTEGER NOT NULL DEFAULT 0,
    `hsvUpperH` INTEGER NOT NULL DEFAULT 179,
    `hsvUpperS` INTEGER NOT NULL DEFAULT 255,
    `hsvUpperV` INTEGER NOT NULL DEFAULT 255,
    `motorSpeedRpm` INTEGER NOT NULL DEFAULT 60,
    `solenoidDelayMs` INTEGER NOT NULL DEFAULT 200,
    `irThreshold` INTEGER NOT NULL DEFAULT 512,
    `manualMode` BOOLEAN NOT NULL DEFAULT false,
    `motorOn` BOOLEAN NOT NULL DEFAULT false,
    `solenoidOn` BOOLEAN NOT NULL DEFAULT false,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `settings_nodeId_key`(`nodeId`),
    INDEX `settings_nodeId_idx`(`nodeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `error_logs` (
    `id` VARCHAR(191) NOT NULL,
    `nodeId` VARCHAR(191) NOT NULL,
    `nodeType` ENUM('CAMERA', 'MICROCONTROLLER') NOT NULL,
    `errorCode` VARCHAR(191) NULL,
    `errorType` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `severity` ENUM('INFO', 'WARNING', 'ERROR', 'CRITICAL') NOT NULL DEFAULT 'ERROR',
    `resolved` BOOLEAN NOT NULL DEFAULT false,
    `resolvedAt` DATETIME(3) NULL,
    `occurredAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `error_logs_nodeId_idx`(`nodeId`),
    INDEX `error_logs_severity_idx`(`severity`),
    INDEX `error_logs_resolved_idx`(`resolved`),
    INDEX `error_logs_occurredAt_idx`(`occurredAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
