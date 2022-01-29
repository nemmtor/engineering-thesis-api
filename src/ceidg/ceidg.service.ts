import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { Company, CompanyResponse } from './ceidg.types';

@Injectable()
export class CeidgService {
  async findOne(taxNumber: string): Promise<CompanyResponse> {
    try {
      const { data } = await axios.get<Company>(
        'https://dane.biznes.gov.pl/api/ceidg/v1/firma',
        {
          params: { nip: taxNumber, status: 'AKTYWNY' },
          headers: { Authorization: `Bearer ${process.env.CEIDG_AUTH_TOKEN}` },
        },
      );

      const company = data.firma[0];

      const addressToTakeDataFrom =
        Object.keys(company.adresDzialanosci).length > 0
          ? company.adresDzialanosci
          : company.adresKorespondencyjny;

      const address = `${addressToTakeDataFrom.ulica}${
        addressToTakeDataFrom.lokal ? `/${addressToTakeDataFrom.lokal}` : ''
      }, ${addressToTakeDataFrom.kod} ${addressToTakeDataFrom.miasto}`;
      return {
        contract: {
          signAddress: address,
        },
        customer: {
          companyAddress: address,
          companyName: company.nazwa,
          email: company.email || '',
          name: `${
            company.wlasciciel.imie.charAt(0).toUpperCase() +
            company.wlasciciel.imie.slice(1).toLowerCase()
          } ${
            company.wlasciciel.nazwisko.charAt(0).toUpperCase() +
            company.wlasciciel.nazwisko.slice(1).toLowerCase()
          }`,
          phone: company.telefon || '',
          taxNumber: company.wlasciciel.nip,
        },
      };
    } catch (_error) {
      throw new BadRequestException();
    }
  }
}
