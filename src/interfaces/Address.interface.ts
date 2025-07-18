interface Address {
  id: string;
  userId?: string;
  cep: string;
  number: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export { Address };
