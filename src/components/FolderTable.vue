<template>
	<v-data-table :headers="headers" :items="desserts" class="elevation-1" style="max-width: 800px;">
		<template v-slot:item.calories="{ item }">
			<v-chip color="blue">
				{{ item.raw.calories }}
			</v-chip>
		</template>
	</v-data-table>
</template>

<script lang="ts" setup>
const headers = [
	{
		title: 'Dessert (100g serving)',
		align: 'start',
		sortable: false,
		key: 'name'
	},
	{ title: 'Calories', key: 'calories' },
	{ title: 'Fat (g)', key: 'fat' },
	{ title: 'Carbs (g)', key: 'carbs' },
	{ title: 'Protein (g)', key: 'protein' },
	{ title: 'Iron (%)', key: 'iron' }
]
const desserts = [
	{
		name: 'Frozen Yogurt',
		calories: 159,
		fat: 6.0,
		carbs: 24,
		protein: 4.0,
		iron: '1%'
	},
	{
		name: 'Ice cream sandwich',
		calories: 237,
		fat: 9.0,
		carbs: 37,
		protein: 4.3,
		iron: '1%'
	},
	{
		name: 'Eclair',
		calories: 262,
		fat: 16.0,
		carbs: 23,
		protein: 6.0,
		iron: '7%'
	}
]
</script>

<style scoped></style>
