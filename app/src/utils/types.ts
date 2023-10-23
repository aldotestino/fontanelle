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

export type GetUserFountainResponse = {
  id: number
  name: string
  street: string
}

export type AddFountainResponse = GetUserFountainResponse & {
  isFree: number
  lat: number
  lng: number
}

export type GetFountainResponse = AddFountainResponse & {
  stars: number
}

export type VoteFountainResponse = {
  fountainId: number
  stars: number
}
