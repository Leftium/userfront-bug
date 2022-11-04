// TODO: Split into union of TS types based on API.
export type UserfrontPayload = {
	page?: number
	filters?: unknown
	roles?: string[]
	email?: string
	name?: string
	data?: {
		crm_id?: number
		slug?: string
		organization?: string
	}
	order?: string
	token?: string
	username?: string
}

// TODO: Split into union of TS types based on API.
export type UserfrontResponse = {
	statusCode: number
	error: {
		type: string
	}
	message: string
	meta: {
		totalPages: number
		totalCount: number
		count: number
	}
	results: unknown[]
	totalCount: number
	userId?: number
	tenantId?: string
	email?: string
	name?: string
	tokens?: {
		name: {
			value: string
		}
	}
}

export type UserfrontUser = {
	userId: number
}

export type UserfrontTenant = {
	tenantId: string
	data?: {
		organization: string
		slug: string
	}
	workspaces?: unknown[]
	name?: string
	slug?: string
	organization?: string
}

export type VeeUser = {
	userId: number
	name: string
	email: string
	crm_id: number
	roles: Record<string, unknown>
}
