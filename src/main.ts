// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
import { faker } from '@faker-js/faker'

import * as uf from './userfront'

const NUM_USERS = 50

const userData = [
	{
		name: faker.name.fullName(),
		email: 'admin@example.com',
		crm_id: faker.datatype.number(10000),
		username: faker.random.alphaNumeric(10),
	},
]

const userRoles = {
	'admin@example.com': {
		workspace1: 'admin',
		workspace2: 'admin',
		workspace3: 'admin',
		workspace4: 'admin',
		workspace5: 'admin',
		workspace6: 'admin',
	},
}

while (userData.length < NUM_USERS) {
	const user = {
		name: faker.name.fullName(),
		email: faker.internet.email(),
		crm_id: faker.datatype.number(10000),
		username: faker.random.alphaNumeric(10),
	}
	userData.push(user)
	userRoles[user.email] = {
		workspace1: 'member',
	}
}

const organizations = [
	{
		name: 'Organization A',
		workspaces: [
			{
				name: 'Workspace 1',
				slug: 'workspace1',
			},
			{
				name: 'Workspace 2',
				slug: 'workspace2',
			},
			{
				name: 'Workspace 3',
				slug: 'workspace3',
			},
		],
	},
	{
		name: 'Organization B',
		workspaces: [
			{
				name: 'Workspace 4',
				slug: 'workspace4',
			},
			{
				name: 'Workspace 5',
				slug: 'workspace5',
			},
		],
	},
	{
		name: 'Organization C',
		workspaces: [
			{
				name: 'Workspace 6',
				slug: 'workspace6',
			},
		],
	},
	{
		name: 'Organization D',
		workspaces: [
			// No workspaces.
		],
	},
]

async function main(): Promise<void> {
	await uf.resetUserfront()

	console.log(`Start seeding UserFront...`)

	const slug2tenant: { [key: string]: string } = {}
	const workspace2organization: { [key: string]: string } = {}

	await Promise.all(
		organizations.map(async (organization) => {
			const organizationTenant = await uf.createTenant({ name: organization.name })
			await Promise.all(
				organization.workspaces.map(async (workspace) => {
					const workspaceTenant = await uf.createTenant(
						{
							name: workspace.name,
							data: {
								slug: workspace.slug,
								organization: organizationTenant.tenantId,
							},
						},
						// organizationTenant.tenantId // Needs userfront to fix child tenant roles API.
					)
					slug2tenant[workspace.slug] = workspaceTenant.tenantId as string
					workspace2organization[workspace.slug] = organizationTenant.tenantId as string
					console.log(
						`Created workspace    with id: ${workspaceTenant.tenantId} (${organization.name}\\${workspace.name})`
					)
				})
			)
			console.log(
				`Created organization with id: ${organizationTenant.tenantId} (${organization.name})`
			)
		})
	)


	userData.map(async (seedUser) => {
		const workspaces = userRoles[seedUser.email]

		const userfrontUser = await uf.createUser({
			name: seedUser.name,
			email: seedUser.email,
			username: seedUser.username,
			data: {
				crm_id: seedUser.crm_id,
			},
		})

		if (workspaces) {
			await Promise.all(
				Object.entries(workspaces).map(async ([workspaceSlug, role]) => {
					const workspaceTenantId: string = slug2tenant[workspaceSlug]
					const organizationTenantId: string = workspace2organization[workspaceSlug]
					const roles = [role] as [string]

					await uf.setUserRoles(userfrontUser.userId as number, roles, workspaceTenantId)

					return uf.setUserRoles(userfrontUser.userId as number, ['member'], organizationTenantId)
				})
			)
		}
		console.log(`Created user with id: ${userfrontUser.userId}`)
	})
	console.log(`Seeding finished.`)
}

main().catch((e) => {
	console.error(e)
	process.exit(1)
})
