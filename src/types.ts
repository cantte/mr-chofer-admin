export enum DriverStatus {
  pending = 'pending',
  accepted = 'accepted',
  rejected = 'rejected'
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
}
