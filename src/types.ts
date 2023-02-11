export enum DriverStatus {
  pending = 'pending',
  accepted = 'accepted',
  rejected = 'rejected'
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

  created_at: string
  updated_at: string

  vehicles: Vehicle | null
  vehicle?: Vehicle
}
