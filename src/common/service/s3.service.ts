// import {
//   S3Client,
//   PutObjectCommand,
//   DeleteObjectCommand,
//   DeleteObjectsCommand,
//   ListObjectsV2Command,
//   ObjectCannedACL
// } from "@aws-sdk/client-s3";

// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import { Upload } from "@aws-sdk/lib-storage";

// import { Injectable, BadRequestException } from "@nestjs/common";

// import { StoreType } from "../enums";
// import { randomUUID } from "crypto";
// import { createReadStream } from "fs";
// import { Express } from "express";
// @Injectable()
// export class S3Service {
//   private readonly s3Client: S3Client;

// import { BadRequestException } from "@nestjs/common";

//   constructor() {
//     this.s3Client = new S3Client({
//       region: process.env.AWS_REGION!,
//       credentials: {
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//       },
//     });
//   }
// uploadFile = async ({
//   storeType = StoreType.memory,
//   Bucket = process.env.AWS_BUCKET_NAME!,
//   path,
//   file,
//   ACL = 'private',
// }: {
//   storeType?: StoreType;
//   Bucket?: string;
//   path: string;
//   file: Express.Multer.File;
//   ACL?: ObjectCannedACL;
// }): Promise<string> => {
//   const command = new PutObjectCommand({
//     Bucket,
//     Key: `${process.env.APPLICATION_NAME!}/${path}/${randomUUID()}_${file.originalname}`,
//     Body:
//       storeType === StoreType.memory
//         ? file.buffer
//         : createReadStream(file.path),
//     ContentType: file.mimetype,
//     ACL,
//   });

//   await s3Client().send(command);
//   if (!command.input.Key) {
// throw new BadRequestException('Failed to upload file');
//   }
//   return command.input.Key;
// uploadLargeFile = async (
//   {
//     storeType = StoreType.disk,
//     Bucket = process.env.AWS_BUCKET_NAME!,
//     path,
//     file,
//     ACL = "private"
//   }: {
//     storeType?: StoreType;
//     Bucket?: string;
//     path: string;
//     file: Express.Multer.File;
//     ACL?: ObjectCannedACL;
//   }
// ): Promise<string> => {
//   const upload = new Upload({
//     client: this.s3Client,
//     params: {
//       Bucket,
//       Key: `${process.env.APPLICATION_NAME!}/${path}/${randomUUID()}_${file.originalname}`,
//       Body: storeType === StoreType.memory ? file.buffer : createReadStream(file.path),
//       ContentType: file.mimetype,
//       ACL
//     }
//   });

//   upload.on("httpUploadProgress", (progress) => {
//     console.log(progress);
//   });

//   const { Key } = await upload.done();
//   if (!Key) {
//     throw new BadRequestException("Failed to upload file");
//   }
//   return Key;
// uploadFiles = async (
//   {
//     storeType = StoreType.memory,
//     Bucket = process.env.AWS_BUCKET_NAME!,
//     path,
//     files,
//     ACL = "private",
//     useLarge = false
//   }: {
//     path: string;
//     files: Express.Multer.File[];
//     storeType?: StoreType;
//     Bucket?: string;
//     ACL?: ObjectCannedACL;
//     useLarge?: boolean;
//   }
// ): Promise<string[]> => {
//   let urls: string[] = [];
//   if (useLarge === false) {
//     urls = await Promise.all(files.map((file) => {
//       return this.uploadFile({
//         storeType,
//         Bucket,
//         path,
//         file,
//         ACL
//       });
//     }));
//   } else {
//     urls = await Promise.all(files.map((file) => {
//       return this.uploadLargeFile({
//         storeType,
//         Bucket,
//         path,
//         file,
//         ACL
//       });
//     }));
//   }
//   return urls;
// };
// createUploadPreSignedUrl = async (
//   {
//     Bucket = process.env.AWS_BUCKET_NAME!,
//     path,
//     originalname,
//     ContentType,
//     expiresIn = 60
//   }: {
//     Bucket?: string;
//     path: string;
//     originalname: string;
//     ContentType: string;
//     expiresIn?: number;
//   }
// ): Promise<{ url: string; key: string }> => {
//   const key = `${process.env.APPLICATION_NAME!}/${path}/${randomUUID()}_${originalname}`;

//   const command = new PutObjectCommand({
//     Bucket,
//     Key: key,
//     ContentType,
//   });

//   const url = await getSignedUrl(this.s3Client, command, { expiresIn });

//   if (!url) {
//     throw new BadRequestException('Failed to generate pre-signed URL');
//   }

//   return { url, key };
// };
// deleteFile = async (
//   {
//     Bucket = process.env.AWS_BUCKET_NAME!,
//     path,
//   }: {
//     Bucket?: string;
//     path: string;
//   }
// ): Promise<any> => {
//   const command = new DeleteObjectCommand({
//     Bucket,
//     Key: path,
//   });
//   return this.s3Client.send(command);
// };
// deleteFiles = async (
//   {
//     Bucket = process.env.AWS_BUCKET_NAME!,
//     urls,
//     Quiet = false
//   }: {
//     Bucket?: string;
//     urls: string[];
//     Quiet?: boolean;
//   }
// ): Promise<any> => {
//   const command = new DeleteObjectsCommand({
//     Bucket,
//     Delete: {
//       Objects: urls.map((url) => {
//         return {
//           Key: url
//         };
//       }),
//       Quiet
//     }
//   });
//   return this.s3Client.send(command);
// };
// listFiles = async (
//   {
//     Bucket = process.env.AWS_BUCKET_NAME!,
//     path,
//   }: {
//     Bucket?: string;
//     path: string;
//   }
// ): Promise<any> => {
//   const command = new ListObjectsV2Command({
//     Bucket,
//     Prefix: `${process.env.APPLICATION_NAME!}/${path}`
//   });
//   return this.s3Client.send(command);
// };
// }
