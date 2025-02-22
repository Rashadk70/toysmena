const fs = require('fs').promises;
const path = require('path');
const archiver = require('archiver');
const mongoose = require('mongoose');
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const { Readable } = require('stream');
const cron = require('node-cron');

class BackupService {
  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    this.bucketName = process.env.AWS_BACKUP_BUCKET;
    this.backupPath = path.join(__dirname, '../backups');

    // Initialize backup schedules
    this.initializeBackupSchedules();
  }

  initializeBackupSchedules() {
    // Daily backup at 2 AM
    cron.schedule('0 2 * * *', async () => {
      try {
        await this.createBackup('daily');
        // Keep only last 7 daily backups
        await this.cleanupOldBackups('daily', 7);
      } catch (error) {
        console.error('Daily backup failed:', error);
      }
    });

    // Weekly backup on Sunday at 3 AM
    cron.schedule('0 3 * * 0', async () => {
      try {
        await this.createBackup('weekly');
        // Keep only last 4 weekly backups
        await this.cleanupOldBackups('weekly', 4);
      } catch (error) {
        console.error('Weekly backup failed:', error);
      }
    });

    // Monthly backup on 1st at 4 AM
    cron.schedule('0 4 1 * *', async () => {
      try {
        await this.createBackup('monthly');
        // Keep only last 3 monthly backups
        await this.cleanupOldBackups('monthly', 3);
      } catch (error) {
        console.error('Monthly backup failed:', error);
      }
    });
  }

  async createBackup(type = 'manual') {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFileName = `backup-${type}-${timestamp}.zip`;
      const backupFilePath = path.join(this.backupPath, backupFileName);

      // Create backups directory if it doesn't exist
      await fs.mkdir(this.backupPath, { recursive: true });

      // Create a write stream to the backup file
      const output = fs.createWriteStream(backupFilePath);
      const archive = archiver('zip', {
        zlib: { level: 9 } // Maximum compression
      });

      archive.pipe(output);

      // Backup MongoDB collections
      const collections = await this.getCollections();
      for (const collection of collections) {
        const data = await this.backupCollection(collection);
        archive.append(JSON.stringify(data, null, 2), { name: `${collection}.json` });
      }

      // Backup uploads directory
      const uploadsDir = path.join(__dirname, '../uploads');
      if (await this.directoryExists(uploadsDir)) {
        archive.directory(uploadsDir, 'uploads');
      }

      // Backup environment variables (excluding sensitive data)
      const envBackup = this.createEnvBackup();
      archive.append(JSON.stringify(envBackup, null, 2), { name: 'environment.json' });

      await archive.finalize();

      // Upload to S3
      await this.uploadToS3(backupFilePath, backupFileName);

      return {
        success: true,
        filename: backupFileName,
        path: backupFilePath
      };
    } catch (error) {
      console.error('Backup creation failed:', error);
      throw error;
    }
  }

  async restoreBackup(backupFile) {
    try {
      const restorePath = path.join(this.backupPath, 'restore');
      await fs.mkdir(restorePath, { recursive: true });

      // If backupFile is an S3 key, download it first
      if (backupFile.startsWith('s3://')) {
        const s3Key = backupFile.replace('s3://', '');
        backupFile = await this.downloadFromS3(s3Key, restorePath);
      }

      // Extract backup
      await this.extractBackup(backupFile, restorePath);

      // Restore collections
      const collections = await fs.readdir(restorePath);
      for (const file of collections) {
        if (file.endsWith('.json')) {
          const collectionName = file.replace('.json', '');
          const data = JSON.parse(
            await fs.readFile(path.join(restorePath, file), 'utf8')
          );
          await this.restoreCollection(collectionName, data);
        }
      }

      // Restore uploads
      const uploadsBackupPath = path.join(restorePath, 'uploads');
      const uploadsPath = path.join(__dirname, '../uploads');
      if (await this.directoryExists(uploadsBackupPath)) {
        await fs.rm(uploadsPath, { recursive: true, force: true });
        await fs.cp(uploadsBackupPath, uploadsPath, { recursive: true });
      }

      // Restore environment variables
      const envFile = path.join(restorePath, 'environment.json');
      if (await this.fileExists(envFile)) {
        const envData = JSON.parse(await fs.readFile(envFile, 'utf8'));
        await this.restoreEnvironment(envData);
      }

      // Cleanup restore directory
      await fs.rm(restorePath, { recursive: true });

      return { success: true };
    } catch (error) {
      console.error('Restore failed:', error);
      throw error;
    }
  }

  async getCollections() {
    return mongoose.connection.db.collections()
      .then(collections => collections.map(c => c.collectionName));
  }

  async backupCollection(collectionName) {
    return mongoose.connection.db.collection(collectionName).find({}).toArray();
  }

  async restoreCollection(collectionName, data) {
    const collection = mongoose.connection.db.collection(collectionName);
    if (data.length > 0) {
      await collection.deleteMany({});
      await collection.insertMany(data);
    }
  }

  createEnvBackup() {
    // Create a sanitized copy of environment variables
    const envBackup = { ...process.env };
    
    // Remove sensitive data
    const sensitiveKeys = [
      'AWS_ACCESS_KEY_ID',
      'AWS_SECRET_ACCESS_KEY',
      'STRIPE_SECRET_KEY',
      'JWT_SECRET',
      'SMTP_PASSWORD'
    ];

    sensitiveKeys.forEach(key => delete envBackup[key]);
    
    return envBackup;
  }

  async restoreEnvironment(envData) {
    // Update .env file with restored data
    const envPath = path.join(__dirname, '../.env');
    const envContent = Object.entries(envData)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    await fs.writeFile(envPath, envContent);
  }

  async uploadToS3(filePath, fileName) {
    try {
      const fileStream = fs.createReadStream(filePath);
      const upload = new Upload({
        client: this.s3Client,
        params: {
          Bucket: this.bucketName,
          Key: fileName,
          Body: fileStream
        }
      });

      await upload.done();
    } catch (error) {
      console.error('S3 upload failed:', error);
      throw error;
    }
  }

  async downloadFromS3(key, destinationPath) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key
      });

      const response = await this.s3Client.send(command);
      const filePath = path.join(destinationPath, key);
      
      await fs.writeFile(filePath, response.Body);
      return filePath;
    } catch (error) {
      console.error('S3 download failed:', error);
      throw error;
    }
  }

  async cleanupOldBackups(type, keep) {
    try {
      // List all backups of the specified type
      const backups = await this.listBackups(type);
      
      // Sort by date (newest first)
      backups.sort((a, b) => b.date - a.date);

      // Remove old backups
      for (let i = keep; i < backups.length; i++) {
        await this.deleteBackup(backups[i].key);
      }
    } catch (error) {
      console.error('Cleanup failed:', error);
      throw error;
    }
  }

  async listBackups(type = null) {
    try {
      const files = await fs.readdir(this.backupPath);
      return files
        .filter(file => {
          if (!file.startsWith('backup-')) return false;
          if (type && !file.includes(`-${type}-`)) return false;
          return true;
        })
        .map(file => ({
          key: file,
          date: new Date(file.split('-').slice(-1)[0].replace('.zip', '')),
          type: file.split('-')[1]
        }));
    } catch (error) {
      console.error('List backups failed:', error);
      throw error;
    }
  }

  async deleteBackup(key) {
    try {
      // Delete from local storage
      const localPath = path.join(this.backupPath, key);
      if (await this.fileExists(localPath)) {
        await fs.unlink(localPath);
      }

      // Delete from S3
      await this.s3Client.send(new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key
      }));
    } catch (error) {
      console.error('Delete backup failed:', error);
      throw error;
    }
  }

  async directoryExists(path) {
    try {
      const stats = await fs.stat(path);
      return stats.isDirectory();
    } catch {
      return false;
    }
  }

  async fileExists(path) {
    try {
      const stats = await fs.stat(path);
      return stats.isFile();
    } catch {
      return false;
    }
  }

  async extractBackup(backupFile, extractPath) {
    const extract = require('extract-zip');
    await extract(backupFile, { dir: extractPath });
  }
}

module.exports = new BackupService();
