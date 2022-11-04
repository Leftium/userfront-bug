// Light wrapper for Userfront API: https://userfront.com/docs/api

import * as dotenv from 'dotenv'

import type {
	UserfrontPayload,
	UserfrontResponse,
	UserfrontUser,
	UserfrontTenant,
} from './userfront-types'

dotenv.config() // Load the environment variables
const { USERFRONT_API_KEY } = process.env
const USERFRONT_GLOBAL_TENANT = process.env.PUBLIC_USERFRONT_GLOBAL_TENANT
const ORIGIN = process.env.ORIGIN || ''

// Handle common work when calling API.
async function callUserfrontApi(
	method: string,
	path: string,
	payload?: UserfrontPayload,
	tenantId?: string
) {
	// console.log({ method, path, payload: payload })
	const tenantPath = tenantId ? `tenants/${tenantId}/` : ''

	const url = `https://api.userfront.com/v0/${tenantPath}${path}`

	const options = {
		method,
		headers: {
			'Content-Type': 'application/json',
			origin: ORIGIN,
			Authorization: `Bearer ${USERFRONT_API_KEY}`,
		},
		body: null,
	}

	let loadAllPages = false

	if (payload) {
		if (payload.page === 0) {
			loadAllPages = true
		}

		options.body = JSON.stringify(payload)
	}

	// console.log({ url, options })
	const firstResponse = await fetch(url, options)

	if (firstResponse.status !== 200) {
		const json = (await firstResponse.json()) as UserfrontResponse

		const errorMessage =
			`${json.statusCode} (${json.error.type}): ${json.message}\n\n` +
			`${method} ${url} payload = ${JSON.stringify(payload, null, 4)}`
		throw new Error(errorMessage)
	}

	const firstJsonPromise = firstResponse.json() as Promise<UserfrontResponse>
	let firstJson: UserfrontResponse

	// Process all pages when page == 0.
	if (loadAllPages && (await firstJsonPromise)?.meta?.totalPages > 1) {
		firstJson = await firstJsonPromise

		// Array of pages left to download:
		const pages = Array.from(Array((firstJson?.meta?.totalPages ?? 0) - 1), (x, i) => i + 2)

		const jsons = (await Promise.all(
			pages.map(async (page) => {
				const newPayload = { ...payload, page }
				const newOptions = {
					...options,
					body: JSON.stringify(newPayload),
				}

				const response = await fetch(url, newOptions)
				if (response.status !== 200) {
					const json = (await response.json()) as UserfrontResponse

					const errorMessage =
						`${json.statusCode} (${json.error.type}): ${json.message}\n\n` +
						`${method} ${url} payload = ${JSON.stringify(newPayload, null, 4)}`
					throw new Error(errorMessage)
				}

				return response.json()
			})
		)) as UserfrontResponse[]

		for (const json of jsons) {
			firstJson.results = firstJson.results.concat(json.results)
		}
		firstJson.meta.count = firstJson.meta.totalCount
		firstJson.meta.totalPages = 0
	}

	return firstJson || firstJsonPromise
}

// Utility function to reduce filter boilerplate.
export function simpleFilters(conjunction: string, filters: unknown) {
	return {
		conjunction: 'and',
		filterGroups: [
			{
				conjunction,
				filters,
			},
		],
	}
}

export async function createUser(payload: UserfrontPayload) {
	return callUserfrontApi('POST', 'users', payload)
}

export async function createOrUpdateUser(payload: UserfrontPayload) {
	return callUserfrontApi('POST', 'users/createOrUpdate', payload)
}

export async function inviteUser(payload: UserfrontPayload) {
	return callUserfrontApi('POST', 'users/invite', payload)
}

export async function createTenant(payload: UserfrontPayload, tenantId?: string) {
	return callUserfrontApi('POST', 'tenants', payload, tenantId)
}

export async function searchTenants(payload: UserfrontPayload) {
	return callUserfrontApi('POST', 'tenants/find', payload, USERFRONT_GLOBAL_TENANT)
}

export async function deleteTenant(id: string) {
	return callUserfrontApi('DELETE', `tenants/${id}`)
}

export async function getWorkspace(slug: string): Promise<UserfrontTenant> {
	const payload = {
		filters: simpleFilters('and', [
			{
				attr: 'data.slug',
				type: 'string',
				comparison: 'is',
				value: slug,
			},
		]),
	}
	const json = await searchTenants(payload)
	const tenants = json.results as UserfrontTenant[]

	return tenants[0]
}

export async function readUser(id: number) {
	return callUserfrontApi('GET', `users/${id}`)
}

export async function searchUsers(payload: UserfrontPayload) {
	return callUserfrontApi('POST', 'users/find', payload)
}

export async function deleteUser(id: number) {
	return callUserfrontApi('DELETE', `users/${id}`)
}

export async function setUserRoles(userId: number, roles: string[], tenantId: string) {
	const payload = { roles }
	return callUserfrontApi('PUT', `users/${userId}/roles`, payload, tenantId)
}

export async function resetUserfront(): Promise<void> {
	console.log('Reset Userfront')

	let json = await searchUsers({
		page: 0,
	})
	let results = await Promise.all(
		json.results.map(async (user: UserfrontUser) => deleteUser(user.userId))
	)
	console.log(`${results.length} users deleted.`)

	json = await searchTenants({
		page: 0,
	})
	results = await Promise.all(
		json.results.map(async (tenant: UserfrontTenant) => deleteTenant(tenant.tenantId))
	)
	console.log(`${results.length} tenants deleted.`)
}

// https://userfront.com/docs/api-client#log-in-with-login-link
export async function loginWithLoginLink(payload: UserfrontPayload) {
	return callUserfrontApi('PUT', 'auth/link', payload)
}
