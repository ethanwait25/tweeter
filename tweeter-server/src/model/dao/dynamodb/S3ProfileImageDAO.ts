import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { ProfileImageDAO } from "../ProfileImageDAO";

export class S3ProfileImageDAO implements ProfileImageDAO {
  private readonly REGION = "us-east-2";
  private readonly BUCKET = "ewait-tweeter-340-profiles";

  async uploadImage(
    userAlias: string,
    imageStringBase64Encoded: string,
    imageFileExtension: string
  ): Promise<string> {
    let decodedImageBuffer: Buffer = Buffer.from(
      imageStringBase64Encoded,
      "base64"
    );
    const fileName =
      userAlias.charAt(1).toLowerCase() +
      "/" +
      userAlias +
      "." +
      imageFileExtension;
    const s3Params = {
      Bucket: this.BUCKET,
      Key: fileName,
      Body: decodedImageBuffer,
      ContentType: `image/${imageFileExtension}`,
    };
    const c = new PutObjectCommand(s3Params);
    const client = new S3Client({ region: this.REGION });
    try {
      await client.send(c);
      return `https://${this.BUCKET}.s3.${this.REGION}.amazonaws.com/${fileName}`;
    } catch (error) {
      throw Error("s3 put image failed with: " + error);
    }
  }

  async deleteImage(url: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  getImageUrl(fileName: string): string {
    return `https://${this.BUCKET}.s3.${this.REGION}.amazonaws.com/${
      fileName.charAt(1).toLowerCase() + "/" + fileName
    }`;
  }
}
