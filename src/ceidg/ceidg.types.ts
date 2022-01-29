export type Address = {
  ulica: string;
  budynek: string;
  lokal: string;
  miasto: string;
  kod: string;
};

export type CompanyOwner = {
  imie: string;
  nazwisko: string;
  nip: string;
};

export type Company = {
  firma: [
    {
      adresDzialanosci: Address;
      adresKorespondencyjny: Address;
      nazwa: string;
      wlasciciel: CompanyOwner;
      email?: string;
      telefon?: string;
    },
  ];
};

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
