import { PostPrivacyEnum } from '@prisma/client';

export class CreatePostDto {
  title: string;
  description?: string;
  privacy?: PostPrivacyEnum;
}
