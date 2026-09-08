export interface Transaction {

  id: string;

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