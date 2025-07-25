interface PackageDetail {
  id?: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

interface PackageDetailResponse {
  data?: PackageDetail[];
  message?: string;
}

// For direct array response
type PackageDetailsArray = PackageDetail[];

interface CreatePackageDetailRequest {
  name: string;
}

interface UpdatePackageDetailRequest {
  id: number;
  name?: string;
}

interface DeletePackageDetailResponse {
  message: string;
  success: boolean;
} 