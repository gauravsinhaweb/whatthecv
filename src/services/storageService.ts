import { apiService } from './apiService'

// Storage API types
export interface StorageInfo {
    free_limit: number
    purchased_limit: number
    total_limit: number
    used_space: number
    available_space: number
    can_create_new: boolean
}

export interface StorageActionInfo {
    id: string
    name: string
    description: string
    amount: number
    category: string
}

export interface StoragePurchaseRequest {
    amount: number
    payment_method?: string
}

export interface StoragePurchaseResponse {
    message: string
    storage_info: StorageInfo
}

// Storage Service class
class StorageService {
    // Storage information
    async getStorageInfo(): Promise<StorageInfo> {
        return apiService.get<StorageInfo>('/resume/storage/info')
    }

    async getStorageActionInfo(): Promise<StorageActionInfo> {
        return apiService.get<StorageActionInfo>('/resume/storage/action-info')
    }

    // Storage operations
    async purchaseStorageSpace(request: StoragePurchaseRequest): Promise<StoragePurchaseResponse> {
        return apiService.post<StoragePurchaseResponse>('/resume/storage/purchase', request)
    }

    // Combined storage and action info
    async getStorageAndActionInfo(): Promise<{
        storageInfo: StorageInfo
        actionInfo: StorageActionInfo
    }> {
        const [storageInfo, actionInfo] = await Promise.all([
            this.getStorageInfo(),
            this.getStorageActionInfo()
        ])

        return { storageInfo, actionInfo }
    }
}

export const storageService = new StorageService() 