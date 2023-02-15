import "dotenv/config";
import { Express, Router, Request, Response, NextFunction } from "express";
import { FileFilterCallback } from "multer";
import * as multer from "multer";
import * as multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";

// AWS-S3 config 설정
const s3Config = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY as string,
    secretAccessKey: process.env.S3_SECRET_KEY as string,
  },
});

// 이미지 확장자 필터: png, jpg, jpeg 이외의 파일이 들어오면 예외
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error("Only .png .jpg and .jpeg format allowed!"));
  }
};

export const upload = multer({
  //* 저장공간
  storage: multerS3({
    //* s3에 저장
    s3: s3Config,
    bucket: "nego-jangteo",
    acl: "public-read-write",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`);
    },
  }),
  //* 이미지 파일 확장자 필터
  fileFilter: fileFilter,

  //* 파일 용량제한: 5MB
  limits: { fileSize: 5 * 1024 * 1024 },
});
