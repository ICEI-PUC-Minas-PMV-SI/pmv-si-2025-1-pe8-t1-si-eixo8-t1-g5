import { Lessee, Owner } from './Person';
import { RealEstate } from './RealEstate';

export type ContractKind = 'Venda com exclusividade' | 'Venda sem exclusividade' | 'Locação com administração' | 'Locação';

export type ContractStatus = 'Ativo' | 'Concluído' | 'Cancelado';

export interface Contract {
  id?: string;
  identifier: string;
  contract_kind: ContractKind;
  start_date: string;
  end_date?: string;
  day_payment?: number;
  payment_value: number;
  duration?: number;
  status: ContractStatus;
  
  owner_id: string;
  owners?: Owner;
  lessee_id?: string;
  lessees?: Lessee;
  real_estate_id: string;
  real_estates?: RealEstate;
  
  created_at?: string;
  updated_at?: string;
} 