// create-userexcel.dto.ts
export class CreateUserExcelDto {
  title?: string | null;
  name: string;
  email: string;
  phone?: string | null;
  agencyEVP?: string | null;
  agencySVP?: string | null;
  agencyDM?: string | null;
  area?: string | null;
  yearWork?: string | null;
}
