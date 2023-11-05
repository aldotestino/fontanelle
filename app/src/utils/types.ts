import { AddPartialFountainSchema } from './validators';

export type User = {
  name: string
  surname: string
  email: string
  picture?: string
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
  reports: {
    1: number,
    2: number,
    3: number,
    4: number,
    5: number
  }
}

export type VoteFountainResponse = {
  fountainId: number
  stars: number
}

export type ReportFountainResponse = {
  fountainId: number
  reason: keyof GetFountainResponse['reports']
}

