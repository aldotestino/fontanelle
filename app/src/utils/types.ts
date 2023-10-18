import { AddPartialFountainSchema } from './validators';

export type User = {
  name: string
  surname: string
  email: string
}

export type Location = {
  lat: number
  lng: number
}

export type AddFountainSchema = AddPartialFountainSchema & {
  lat: number
  lng: number
  street: string
}

export type AddFountainResponse = {
  id: number
  name: string
  isFree: number
  lat: number
  lng: number
  street: string
}

export type GetFountainResponse = AddFountainResponse