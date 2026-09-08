export interface Transaction {

  id: string;

  UserId: string;

  datum: string;

  rekening: string;

  categorie: string;

  bedrag: number;

  type: string;

  intern: boolean;

  project: boolean;

  tegenpartij: string;

  opmerking: string;

}