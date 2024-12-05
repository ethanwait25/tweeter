export interface ProfileImageDAO {
    uploadImage(userAlias: string, imageStringBase64Encoded: string, imageFileExtension: string): Promise<string>
    deleteImage(url: string): Promise<void>
    getImageUrl(userAlias: string): string
}