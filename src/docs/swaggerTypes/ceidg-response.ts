import { ApiProperty } from '@nestjs/swagger';

export type CompanyResponse = {
  contract: {
    signAddress: string;
  };

  customer: {
    companyAddress: string;
    companyName: string;
    email: string;
    name: string;
    phone: string;
    taxNumber: string;
  };
};

export class CeidgCompany {
  @ApiProperty({ example: { signAddress: 'ul. Polna 8f/25, 87-100 Toruń' } })
  contract: {
    signAddress: string;
  };

  @ApiProperty({
    example: {
      companyAddress: 'ul. Polna 8f/25, 87-100 Toruń',
      companyName: 'Przykładowa Firma Andrzej Kowalski',
      email: 'andrzejkowalski@example.com',
      name: 'Andrzej Kowalski',
      phone: '601200300',
      taxNumber: '9562305912',
    },
  })
  customer: {
    companyAddress: string;
    companyName: string;
    email: string;
    name: string;
    phone: string;
    taxNumber: string;
  };
}
