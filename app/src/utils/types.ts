import { AddPartialFountainSchema } from './validators';

export interface User {
  name: string
  surname: string
  email: string
}

export interface Location {
  lat: number
  lng: number
}

export interface AddFountainSchema extends AddPartialFountainSchema {
  lat: number
  lng: number
  street: string
}