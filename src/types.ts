export enum DriverStatus {
  pending = 'pending',
  accepted = 'accepted',
  rejected = 'rejected',
  archived = 'archived',
}

export type Vehicle = {
  license_plate: string
  engine_displacement: string
  brand: string
  model: string
  line: string
  color: string
  type: string

  property_card_photo_url_front: string
  property_card_photo_url_back: string

  created_at: string
}

export type Driver = {
  id: string
  name: string
  gender: string
  phone: string
  photo_url: string
  city: string

  status: DriverStatus

  id_photo_url_front: string
  license_photo_url_front: string
  id_photo_url_back: string
  license_photo_url_back: string

  contract_url: string | null
  notary_power_url: string | null

  created_at: string
  updated_at: string

  vehicles: Vehicle | null
  vehicle?: Vehicle
}

export type Report = {
  rides: number
}

export type Passenger = {
  name: string
  phone: string
}

export type OnlyName = {
  name: string
}

export type Ride = {
  id: string
  request_time: string
  start_time: string
  end_time: string
  final_price: number
  status: string
}

export type PassengersTableData = {
  passengers: Passenger[]
  total: number
  totalPages: number
}

export type RideHistory = {
  id: string
  request_time: string
  gender: string
  affiliate_id: string
  status: string
  passengers?: OnlyName
  drivers?: OnlyName
}
