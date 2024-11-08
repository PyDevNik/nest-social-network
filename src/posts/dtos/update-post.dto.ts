import { PostPrivacyEnum } from '@prisma/client';

export class UpdatePostDto {
  title?: string;
  description?: string;
  privacy?: PostPrivacyEnum;
}
