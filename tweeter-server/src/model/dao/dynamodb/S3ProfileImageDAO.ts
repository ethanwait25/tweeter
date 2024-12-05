import { ProfileImageDAO } from "../ProfileImageDAO";

export class S3ProfileImageDAO implements ProfileImageDAO {
    async uploadImage(
        userAlias: string,
        imageStringBase64Encoded: string,
        imageFileExtension: string
      ): Promise<string> {
        let decodedImageBuffer: Buffer = Buffer.from(
          imageStringBase64Encoded,
          "base64"
        );
        const s3Params = {
          Bucket: BUCKET,
          Key: "image/" + userAlias + "." + imageFileExtension,
          Body: decodedImageBuffer,
          ContentType: "image/png",
          ACL: ObjectCannedACL.public_read,
        };
        const c = new PutObjectCommand(s3Params);
        const client = new S3Client({ region: REGION });
        try {
          await client.send(c);
          return (
          `https://${BUCKET}.s3.${REGION}.amazonaws.com/image/${fileName}`
          );
        } catch (error) {
          throw Error("s3 put image failed with: " + error);
        }
      }

    deleteImage(url: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    getImageUrl(userAlias: string): string {
        throw new Error("Method not implemented.");
    }
}